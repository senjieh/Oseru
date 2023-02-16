# primary function is to take a MIDI file and output a JSON file with a list containing
# the JSON file will be the notes in which the order they are supposed to be played

# messages - everything defaults to 0 if no value except
# velocity defaults to 64 if no value (middle velocity) and data to ()

# notes are only added if they have both note-on and note-off messages - req. for MIDI files

import mido
import midiMapping as mm
from collections import namedtuple
import heapq
import json

data = namedtuple('data',['time_played', 'note', 'note_held','velocity','channel'])
# format that data is output to JSON file in.

class readMidi():

    def __init__(self, songTitle, mainChannel):
        """ A songTitle and mainChannel must be passed in to properly initialize this class where
        songTitle is the name of the MIDI file without the MIDI extension and mainChannel is a list
        of channels that play the primary instruments.
        """

        self.songTitle = songTitle
        self.musicArray = []
        self.musicMatch = []
        self.mainInstChannel = mainChannel #eventually should be self.determineMainChannel()

    def determineMainChannel(self):
        """ Returns an array that contains the main channel(s) on which the primary instrument will be played."""
        pass

    def midiToArray(self):
        """ Creates an array for the notes of the main instrument with the format of the data namedTuple above.
        each array value = ['time_played', 'note', 'note_held','velocity','channel'] and will be heapified based
        on the time_played in order to get the notes in the proper order."""

        heapq.heapify(self.musicArray)
        total_time = 0
        midiFile = "midifiles/" + str(self.songTitle) + ".mid"

        for msg in mido.MidiFile(midiFile):
            print(msg)
            if msg.is_meta:
                #print(msg)
                print(msg.hex())
            total_time += msg.time
            if msg.type == 'note_on' and msg.velocity > 0 and msg.channel in self.mainInstChannel:
                self.musicMatch.append((total_time, msg.note, msg.time, msg.velocity, msg.channel))
            if msg.type == 'note_off':
                for note in self.musicMatch:
                    if msg.note == note[1] and msg.channel == note[4]:
                        notedata = note
                        if notedata[2] == 0:
                            note_held = total_time - note[0]
                        else:
                            note_held = notedata[2]
                        message = data(notedata[0], notedata[1], note_held, notedata[3], notedata[4])
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
            for x in range(16):
                channelList.append(x)
            for y in self.mainInstChannel:
                channelList.remove(y)
        with mido.open_output('IAC Driver Bus 1') as port:
            for msg in mid.play():
                if (msg.type == 'note_on' or msg.type == 'note_off') and (msg.channel in channelList):
                    print(msg)
                    port.send(msg)

    def playArray(self):
        """ This method converts the notes in the array to MIDI messages and output them to a port,
        but does not save them in a MIDI file."""
        pass

    def toJSON(self):
        jsonFile = "jsonMidi/" + str(self.songTitle) + ".json"
        with open(jsonFile, "w") as out:
            json.dump(self.musicArray, out)

    def updateJSON(self):
        pass

if __name__ == "__main__":

    # songTitle MUST be the name of the midi file without the midi extension
    # mainChannel MUST be a list of the channels that play the primary instruments

    midiObj = readMidi(songTitle="SilentNight", mainChannel=[2])
    midiObj.midiToArray()
    print("midi to array done")
    midiObj.toJSON()
    print("midi to json done")
    midiObj.playMidi()
    print("play midi done")


# additional crap i may need to remember

# find ports with mido.get_output_names(), mido.get_input_names()
# input/output port on my mac is 'IAC Driver Bus 1'

#for i, track in enumerate(mid.tracks):
#               print('Track {}: {}'.format(i, track.name))

# if MIDI channel prefix message precedes a MIDI instrument name message then that instrument is tied to that channel
