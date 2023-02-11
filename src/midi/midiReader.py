# primary function is to take a MIDI file and output a JSON file with a list containing
# the JSON file will be the notes in which the order they are supposed to be played

# find ports with mido.get_output_names(), mido.get_input_names()
# input/output port on my mac is 'IAC Driver Bus 1'
# you have to open garageBand for input-output tho...
# how will this work with the app?

# messages - everything defaults to 0 if no value except
# velocity defaults to 64 if no value (middle velocity) and data to ()

# need to add functionality to track notes between channels
# and determine instrument played between channels
# determine channel with msg.channel

import mido
import midiMapping as mm
from collections import namedtuple
import heapq
import json

data = namedtuple('data',['time_played', 'note', 'note_held','velocity','channel'])
# format that data is output to JSON file in.

class readMidi():

    def __init__(self, songTitle):

        self.songTitle = songTitle
        self.musicArray = []
        self.musicMatch = []

    def midiToArray(self):
        heapq.heapify(self.musicArray)
        total_time = 0
        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
        mid = mido.MidiFile(midiFile)
        with mido.open_output('IAC Driver Bus 1') as port:
            for msg in mid.play():
                port.send(msg)
                total_time += msg.time
                if msg.type == 'note_on' and msg.velocity > 0:
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

    def toJSON(self):
        jsonFile = "jsonMidi/" + str(self.songTitle) + ".json"
        with open(jsonFile, "w") as out:
            json.dump(self.musicArray, out)

    def updateJSON(self):
        pass

if __name__ == "__main__":

    # song title MUST be the name of the midi file without the midi extension
    # also a GRAVE error to call updateJSON() when the musicArray is empty
    # need to put in some sort of check to prevent that from happening

    midiObj = readMidi("DrDre-StillDre")
    midiObj.midiToArray()
    #midiObj.toJSON()


# additional crap i may need to remember

#msg = mido.Message('note_on',note=60)
#print(msg.type,msg.note)
#print(msg.bytes())
#print(msg.copy(channel=2))

#with mido.open_input() as inport:
#    for msg in inport:
#        print(msg)

#for i, track in enumerate(mid.tracks):
#               print('Track {}: {}'.format(i, track.name))