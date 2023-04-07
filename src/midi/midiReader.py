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
from json import JSONEncoder
import os.path

data = namedtuple('data',['time_played', 'midi_note', 'frequency', 'note_held','velocity','channel'])
# format that data is output to JSON file in.

class noteArray():
    def __init__(self, time_played, midi_note, note_held, velocity, channel):
        self.time_played = time_played
        self.midi_note = midi_note

class channelInfo():
    def __init__(self, channel, inst, noteCount):
        self.channel = channel
        self.inst = inst
        self.noteCount = noteCount
        self.msgTimes = []

class channelEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__
    
def inChannelDict(channelList, channel, inst):
        """Simple method that checks whether channel+inst exists in channellist."""
        instruments = channelList[channel]
        print(instruments)
       # for i in channelList:
       #     if (channel == i.channel) and (inst == i.inst):
       #         return True
       # return False
    
def getChannelListLoc(channelList, channel, inst):
    """Simple method that returns the index of a channel+inst in list."""
    for i in channelList:
        if (channel == i.channel) and (inst == i.inst):
            return channelList.index(i)
    return -1

class midi2Array():

    def __init__(self, songTitle, filePath):
        """ A songTitle and mainChannel must be passed in to properly initialize this class where
        songTitle is the name of the MIDI file without the MIDI extension and mainChannel is a list
        of channels that play the primary instruments.
        """

        self.songTitle = songTitle
        self.filePath = filePath
        midiFile = filePath + str(self.songTitle) + ".mid"
        if not os.path.isfile(midiFile):
            print("Error: File Not Found")
            return -1
        self.musicArray = []
        self.musicMatch = []

    def determineMethod(self):
        mainInstChannel, supportInstChannel = self.determineMainChannel()
        instList = self.instList()

        if (len(mainInstChannel) + len(supportInstChannel)) == 0:
            print("No Channels Found")
            return -1
        
        print(len(instList))
        print(len(mainInstChannel))
        print(len(supportInstChannel))
        # this is the case for when instList has no channel switches
        if (len(mainInstChannel) + len(supportInstChannel)) == len(instList):
            self.midiToArray(mainInstChannel)
            return 0
        
        elif (len(mainInstChannel) + len(supportInstChannel)) != len(instList):
            print("there are channel switches!!!")

        #need to re-work these cases
        #elif (len(mainInstChannel) + len(supportInstChannel)) == len(instList) and instList has channel switches:
        #   implement new method here!
        #elif (len(mainInstChannel) + len(supportInstChannel)) == len(instList) and instList has NO channel switches:
        #   self.midi2Array(mainInstChannel)

    def instList(self):
        """Outputs a JSON file that tracks when channels switch instruments and the corresponding
            note counts for each instrument."""
        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
        mid = mido.MidiFile(midiFile)
        channelList = {}
        channelStatus = {}
        msgcount = 0
        ttlNotes = 0

    # channel data structure =
    # dictionary where the key is the channel and the values are a list of  dictionaries for each instrument that contains a list with
    # the total note count for that instrument on that channel and then a tuple for each time the channel switched on and off of that inst.

        for msg in mid:
            msgcount += 1
            if msg.type == 'program_change':
                print(msg)
                #does channel exist in channelDict -> if not add it
                #elif inChannelDict(channelDict, msg.channel, msg.program):
                #    continue
                #else:
                #   append message to the dictionary value in channelDict


                #if inChannelList(channelList, msg.channel, msg.program):
                #    channelStatus[msg.channel] = msg.program
                #    obj = getChannelListLoc(channelList, msg.channel, msg.program)
                #    msgTimes = channelList[obj].msgTimes
                #    msgTimes.append(ttlNotes)
                #    channelList[obj].msgTimes = msgTimes
                #else:
                #    channelList.append(channelInfo(msg.channel, msg.program, ttlNotes))
                #    channelStatus[msg.channel] = msg.program
                   # obj = getChannelListLoc(channelList, msg.channel, msg.program)
                   # channelList[obj].msgTimes.append(ttlNotes)
            
            #if msg.type == 'note_on':
            #    ttlNotes += 1
            #    currentInst = channelStatus[msg.channel]
            #    for i in channelList:
            #        if (msg.channel == i.channel) and (currentInst == i.inst):
            #            notes = i.noteCount
            #            i.noteCount = notes + 1
       # print("REsULTS")
       # print(channelStatus)
       # for i in channelList:
       #     print(i.channel, i.inst, i.noteCount, sep=" ")   

        return channelList
       # jsonFile = "channelList/" + str(self.songTitle) + "_channels" + ".json"
       # with open(jsonFile, "w") as out:
       #     json.dump(channelList, out, indent=4, cls=channelEncoder)
        

    def determineMainChannel(self):
        """ Returns an array that contains the main channel(s) on which the primary instrument will be played and
        assigns all other channels to be supporting instrument channels."""
        midiFile = self.filePath + str(self.songTitle) + ".mid"
        mid = mido.MidiFile(midiFile)
        noteCount = {}
        mainInstChannel = []
        supportInstChannel = []
        backupChannel = []

        tier1inst = ["Piano", "Guitar", "Strings"]
        tier2inst = ["Chromatic Percussion", "Synth Lead","Organ"]
        for msg in mid:
            if msg.type == 'note_on' or msg.type == 'note_off':
                if msg.channel not in noteCount:
                    noteCount[msg.channel] = 1
                else:
                    prevCount = noteCount[msg.channel]
                    noteCount[msg.channel] = prevCount + 1
        for msg in mid:
            if msg.type == 'program_change':
                inst = im.getInstClass(msg.program)
                if inst in tier1inst:
                    if msg.channel not in mainInstChannel:
                        mainInstChannel.append(msg.channel)
                elif inst in tier2inst:
                    if msg.channel not in backupChannel:
                        backupChannel.append(msg.channel)
                else:
                    if msg.channel not in supportInstChannel:
                        supportInstChannel.append(msg.channel)

        if len(mainInstChannel) == 0 and len(backupChannel) != 0:
            for i in backupChannel:
                mainInstChannel.append(i)
        else:
            for i in backupChannel:
                if i not in supportInstChannel:
                    supportInstChannel.append(i)

        noteCountList = list(noteCount.keys())
        toBeDel = []
        for i in mainInstChannel:
            if i not in noteCountList:
                toBeDel.append(i)
        for j in toBeDel:
            mainInstChannel.remove(j)   
    
        toBeMoved = []
        if len(mainInstChannel) > 1:
            mostNotes = 0
            leadChannel = 0
            for i in mainInstChannel:
                if noteCount[i] > mostNotes:
                    mostNotes = noteCount[i]
                    leadChannel = i
            for j in mainInstChannel:
                if j != leadChannel:
                    toBeMoved.append(j)

        if len(toBeMoved) > 0:
            for k in toBeMoved:
                if k in mainInstChannel:
                    mainInstChannel.remove(k)
                if k not in supportInstChannel:
                    supportInstChannel.append(k)

        return mainInstChannel, supportInstChannel

    def midiToArray(self, mainInstChannel):
        """ Creates an array for the notes of the main instrument with the format of the data namedTuple above.
        each array value = ['time_played', 'note', 'note_held','velocity','channel'] and will be heapified based
        on the time_played in order to get the notes in the proper order."""

        heapq.heapify(self.musicArray)
        total_time = 0
        midiFile = self.filePath + str(self.songTitle) + ".mid"
        for msg in mido.MidiFile(midiFile):
            total_time += msg.time
            if msg.type == 'note_on' and msg.velocity > 0 and msg.channel in mainInstChannel:
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
        print(self.musicArray)
        jsonFile = "jsonMidi/" + str(self.songTitle) + ".json"
        with open(jsonFile, "w") as out:
            json.dump(self.musicArray, out)

    def playMidi(self, mainChannel, supportChannel, mainInst=True,supportInst=True):
        """ This function plays the Midi File. mainInst determines if the channels that have been identified
        as primary instrument channels will be played aloud. supportInst determines if all other channels
        will be played aloud. Default values for both are True. """

        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
        mid = mido.MidiFile(midiFile)
        channelList = []
        if mainInst:
            for x in mainChannel:
                channelList.append(x)
        if supportInst:
            for y in supportChannel:
                channelList.append(y)
        with mido.open_output('IAC Driver Bus 1') as port:
            for msg in mid.play():
                if (msg.type == 'note_on' or msg.type == 'note_off') and (msg.channel in channelList):
                    port.send(msg)

if __name__ == "__main__":

    # songTitle MUST be the name of the midi file without the midi extension
    # noteThreshold is the number of notes that must be played on a specific channel for that channel to be considered
    # a main channel. Note there are other constraints on main channel, such as instType.

    #midiObj = midi2Array(songTitle="UnderTheSea-LittleMermaid")
    #midiObj.instList()
    #print(midiObj.mainInstChannel)
    #midiObj.determineMainChannel()
    #print(midiObj.mainInstChannel)
    #midiObj.playMidi([8], mainInst=True, supportInst=False)
    #midiObj.midiToArray()
    #midiObj.toJSON()
   # silent = midi2Array(songTitle="MichaelJackson-BillieJean",filePath="midifiles/")
    #silent.determineMethod()

    rhcp = midi2Array(songTitle="RedHotChiliPeppers-Californication",filePath="midifiles/")
    rhcp.playMidi([0],[2,3,9,6,0],supportInst=False)
    # we want 0 to be the main channel but determineMainChannel is returning 1 as the mainChannel
    # finish implementing instList() and see what that recommends

    #minst, sinst = rhcp.determineMainChannel()
    #print(minst)
    #print(sinst)
    #silent.playMidi([9], supportInst=False)
    #minst, sinst = silent.determineMainChannel()
    #print("MAIN")
   # print(minst)
    #print("SUPPORT")
    #print(sinst)
    #silent.instList()
    #silent.midiToArray()
    #silent.playMidi(mainInst=True, supportInst=False)
    #silent.toJSON()
    #midiObj.playMidi(mainInst=True,supportInst=False)
    
# SILENT NIGHT - JSON DONE, NO MOD TO BE DONE - NO SUPPORTING TRACKS TO BE PLAYED
# main channel = 0, no supporting inst channels

# under the sea main channels = 2, 13, 4, not 12....


