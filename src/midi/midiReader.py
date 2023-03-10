# primary function is to take a MIDI file and output a JSON file with a list containing
# the JSON file will be the notes in which the order they are supposed to be played

# messages - everything defaults to 0 if no value except
# velocity defaults to 64 if no value (middle velocity) and data to ()

# notes are only added if they have both note-on and note-off messages - req. for MIDI files

import mido
import midiMapping as mm
import instMapping as im
from collections import namedtuple
import heapq
import json

data = namedtuple('data',['time_played', 'midi_note', 'frequency', 'note_held','velocity','channel'])
# format that data is output to JSON file in.

class channelInfo():
    def __init__(self, channel, inst, noteCount):
        self.channel = channel
        self.inst = inst
        self.noteCount = noteCount
        self.msgTimes = []

class midi2Array():

    def __init__(self, songTitle):
        """ A songTitle and mainChannel must be passed in to properly initialize this class where
        songTitle is the name of the MIDI file without the MIDI extension and mainChannel is a list
        of channels that play the primary instruments.
        """

        self.songTitle = songTitle
        self.musicArray = []
        self.musicMatch = []
        self.mainInstChannel = []
        self.supportInstChannel =  []
        #self.determineMainChannel()

# to determine main channel

# step 1 - find which channels are tied to which instruments and track whether
# the channels change instruments

# step 2 - assign each channel the instrument that it switches to most often
# or plays the most notes in that instrument?

# step 3 - determine which types of instruments will be potential "primary" instruments
# will need different tiers - if no primary instruments found in tier 1 - move on to tier 2 etc..

# step 4 - determine the note counts of each main instrument

# step 5 - determine which instruments to keep in main instrument
# for some midi files, it will work to just select the main inst with the highest notes
# for other midi files, may need multiple main instruments....

# if a midi file is simple i.e. every channel only assigned one inst -> just pick channel with highest note count

# will need to add steps in midiToArray to ensure that only notes on that channel
# played with the "assigned" instrument are added to the array

# parse through ALL messages in MIDI
# if msg == program change -> add channelInfo to channelList
    # if channel not in channelList then add channel,inst to channelStatus
    # if channel already in channelList then update channelStatus to new Inst
# if msg == note_on ->
    # check channelStatus -> find appropriate channel+inst in channelList and increment count

    def inChannelList(self, channelList, channel, inst):
        for i in channelList:
            if (channel == i.channel) and (inst == i.inst):
                return True
        return False
    
    def getChannelListLoc(self, channelList, channel, inst):
        if not self.inChannelList(channelList, channel, inst):
            return -1

        for i in channelList:
            if (channel == i.channel) and (inst == i.inst):
                return channelList.index(i)

    def instList(self):

        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
        mid = mido.MidiFile(midiFile)
        channelList = []
        channelStatus = {}
        msgcount = 0

        for msg in mid:
            msgcount += 1
            if msg.type == 'program_change':
                if self.inChannelList(channelList, msg.channel, msg.program):
                    channelStatus[msg.channel] = msg.program 
                else:
                    channelList.append(channelInfo(msg.channel, msg.program, 0))
                    channelStatus[msg.channel] = msg.program
            
            if msg.type == 'note_on':
                currentInst = channelStatus[msg.channel]
                for i in channelList:
                    if (msg.channel == i.channel) and (currentInst == i.inst):
                        notes = i.noteCount
                        i.noteCount = notes + 1

        print(channelStatus)
        for i in channelList:
            print(i.channel, i.inst, i.noteCount, sep=" ")      


    def determineMainChannel(self):
        """ Returns an array that contains the main channel(s) on which the primary instrument will be played and
        assigns all other channels to be supporting instrument channels."""
        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
        mid = mido.MidiFile(midiFile)
        noteCount = {}

        tier1inst = ["Piano", "Guitar", "Strings"]
        tier2inst = ["Chromatic Percussion", "Synth Lead"]
        for msg in mid:
            if msg.type == 'note_on' or msg.type == 'note_off':
                if msg.channel not in noteCount:
                    noteCount[msg.channel] = 1
                else:
                    prevCount = noteCount[msg.channel]
                    noteCount[msg.channel] = prevCount + 1
        for msg in mid:
            if msg.type == 'program_change':
                print(msg, noteCount[msg.channel])
                inst = im.getInstClass(msg.program)
                print(inst)
                if inst in tier1inst:
                    if msg.channel not in self.mainInstChannel:
                        self.mainInstChannel.append(msg.channel)
                # need course of action if we don't have any of these.... upload all to main inst?
                else:
                    if msg.channel not in self.supportInstChannel:
                        self.supportInstChannel.append(msg.channel)
        print(noteCount)
        print(self.mainInstChannel)
        print(self.supportInstChannel) 

        if len(self.mainInstChannel) > 1:
            mostNotes = 0
            leadChannel = 0
            for i in self.mainInstChannel:
                if noteCount[i] > mostNotes:
                    mostNotes = noteCount[i]
                    leadChannel = i
            for j in self.mainInstChannel:
                if j != leadChannel:
                    self.supportInstChannel.append(j)
            for j in self.supportInstChannel:
                if j in self.mainInstChannel:
                    self.mainInstChannel.remove(j)

        print(self.mainInstChannel)
        print(self.supportInstChannel)

    def midiToArray(self):
        """ Creates an array for the notes of the main instrument with the format of the data namedTuple above.
        each array value = ['time_played', 'note', 'note_held','velocity','channel'] and will be heapified based
        on the time_played in order to get the notes in the proper order."""

        heapq.heapify(self.musicArray)
        total_time = 0
        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
        print("Main inst: ", self.mainInstChannel)
        for msg in mido.MidiFile(midiFile):
            total_time += msg.time
            if msg.type == 'note_on' and msg.velocity > 0 and msg.channel in self.mainInstChannel:
                freq = mm.MIDI_to_frequency[msg.note]
                self.musicMatch.append((total_time, msg.note, freq, msg.time, msg.velocity, msg.channel))
            if msg.type == 'note_off':
                for note in self.musicMatch:
                    if msg.note == note[1] and msg.channel == note[5]:
                        notedata = note
                        if notedata[3] == 0:
                            note_held = total_time - note[0]
                        else:
                            note_held = notedata[3]
                        freq = mm.MIDI_to_frequency[notedata[1]]
                        message = data(notedata[0], notedata[1], freq, note_held, notedata[4], notedata[5])
                        self.musicMatch.remove(note)
                        heapq.heappush(self.musicArray, message)
                        continue

    def playMidi(self,mainInst=True,supportInst=True):
        """ This function plays the Midi File. mainInst determines if the channels that have been identified
        as primary instrument channels will be played aloud. supportInst determines if all other channels
        will be played aloud. Default values for both are True. """

        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
        mid = mido.MidiFile(midiFile)
        channelList = []
        if mainInst:
            for x in self.mainInstChannel:
                channelList.append(x)
        if supportInst:
            for y in self.supportInstChannel:
                channelList.append(y)
        with mido.open_output('IAC Driver Bus 1') as port:
            for msg in mid.play():
                if (msg.type == 'note_on' or msg.type == 'note_off') and (msg.channel in channelList):
                    print(msg)
                    port.send(msg)

    def toJSON(self):
        jsonFile = "jsonMidi/" + str(self.songTitle) + ".json"
        with open(jsonFile, "w") as out:
            json.dump(self.musicArray, out)

if __name__ == "__main__":

    # songTitle MUST be the name of the midi file without the midi extension
    # noteThreshold is the number of notes that must be played on a specific channel for that channel to be considered
    # a main channel. Note there are other constraints on main channel, such as instType.

    midiObj = midi2Array(songTitle="UnderTheSea-LittleMermaid")
    midiObj.instList()
    #midiObj.playMidi(mainInst=True, supportInst=False)
    #midiObj.midiToArray()
    #midiObj.toJSON()
    #silent = midi2Array(songTitle="SilentNight")
    #silent.instList()
    #silent.midiToArray()
    #silent.playMidi(mainInst=True, supportInst=False)
    #silent.toJSON()
    #midiObj.playMidi(mainInst=True,supportInst=False)
    
# silent night main channel should be 2
# channel 6 has annoying stuff 
# channel 1 and 3 has some stuff???

# under the sea main channels = 2, 13, 4, not 12....

# additional crap i may need to remember

# find ports with mido.get_output_names(), mido.get_input_names()
# input/output port on my mac is 'IAC Driver Bus 1'

#for i, track in enumerate(mid.tracks):
#               print('Track {}: {}'.format(i, track.name))

# if MIDI channel prefix message precedes a MIDI instrument name message then that instrument is tied to that channel
