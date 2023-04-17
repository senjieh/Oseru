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

class noteObj():
    def __init__(self, time_played, midi_note, frequency, note_held, velocity, channel):
        self.time_played = time_played
        self.midi_note = midi_note
        self.frequency = frequency
        self.note_held = note_held
        self.velocity = velocity
        self.channel = channel

class channelEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

def midiToArray(file, inPath, outPath, mainInstChannel, createJson):
    """ Creates an array for the notes of the main instrument with the format of the data namedTuple above.
    each array value = ['time_played', 'note', 'note_held','velocity','channel'] and will be heapified based
    on the time_played in order to get the notes in the proper order."""
    musicMatch = []
    musicArray = []

    total_time = 0
    for msg in mido.MidiFile(inPath+file):
        total_time += msg.time
        if msg.type == 'note_on' and msg.velocity > 0 and msg.channel in mainInstChannel:
            freq = mm.MIDI_to_frequency[msg.note]
            musicMatch.append((total_time, msg.note, freq, msg.time, msg.velocity, msg.channel))
        if msg.type == 'note_off':
            for note in musicMatch:
                if msg.note == note[1] and msg.channel == note[5]:
                    notedata = note
                    if notedata[3] == 0:
                        note_held = total_time - note[0]
                    else:
                        note_held = notedata[3]
                    freq = mm.MIDI_to_frequency[notedata[1]]
                    message = noteObj(notedata[0], notedata[1], freq, note_held, notedata[4], notedata[5])
                    musicMatch.remove(note)
                    musicArray.append(message)
                    continue

    if len(musicArray) <= 0:
        print("This Midi File did not generate a music Array. Aborting.")
        return -1

    musicArray.sort(key=lambda x: x.time_played)
    
    if createJson:
        jsonFile = outPath + file[:-4] + ".json"
        with open(jsonFile, "w") as out:
            json.dump([ob.__dict__ for ob in musicArray], out)

    else:
        for x in musicArray:
            print(x.time_played, x.midi_note, x.frequency, x.note_held, x.velocity, x.channel)
        print("JSON file not created")

    return 0

def midiToArrayComplicated(file, inPath, outPath, mainInstChannel, InstList, createJson):
    """Similar functionality as midiToArray except for midi files that do channel switching i.e.
    when channels switch to different instruments mid song."""
    musicMatch = []
    musicArray = []

    total_time = 0
    # incorporate message count
    # incorporate inst list
    for msg in mido.MidiFile(inPath+file):
        total_time += msg.time
        if msg.type == 'note_on' and msg.velocity > 0 and msg.channel in mainInstChannel:
            freq = mm.MIDI_to_frequency[msg.note]
            musicMatch.append((total_time, msg.note, freq, msg.time, msg.velocity, msg.channel))
        if msg.type == 'note_off':
            for note in musicMatch:
                if msg.note == note[1] and msg.channel == note[5]:
                    notedata = note
                    if notedata[3] == 0:
                        note_held = total_time - note[0]
                    else:
                        note_held = notedata[3]
                    freq = mm.MIDI_to_frequency[notedata[1]]
                    message = noteObj(notedata[0], notedata[1], freq, note_held, notedata[4], notedata[5])
                    musicMatch.remove(note)
                    musicArray.append(message)
                    continue

    if len(musicArray) <= 0:
        print("This Midi File did not generate a music Array. Aborting.")
        return -1

    musicArray.sort(key=lambda x: x.time_played)
    
    if createJson:
        jsonFile = outPath + file[:-4] + ".json"
        with open(jsonFile, "w") as out:
            json.dump([ob.__dict__ for ob in musicArray], out)

    else:
        for x in musicArray:
            print(x.time_played, x.midi_note, x.frequency, x.note_held, x.velocity, x.channel)
        print("JSON file not created")

    return 0

def playMidi(file, inPath, mainChannel, supportChannel, mainInst=True,supportInst=True):
    """ This function plays the Midi File. mainInst determines if the channels that have been identified
    as primary instrument channels will be played aloud. supportInst determines if all other channels
    will be played aloud. Default values for both are True. """

    midiFile = inPath + file
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
   #playMidi("RedHotChiliPeppers-Californication.mid","midifiles/",[9],[1], supportInst=False)
    # californication
    # channel 1 is not the main channel, supporting bass or something
    # channel 2,3 plays nothing?
    # channel 0 is just like channel 1 with some additional melody, possibly main channel
    # channel 6 is supporting bells

    #playMidi("BackStreetBoys-IWantItThatWay.mid","midifiles/",[5],[1,3,8,9,10,11,13,15,2,0,4,6,7,12,14],supportInst=False)

    playMidi("Beethoven-FurElise.mid","midifiles/",[0,12],[0,1,12,13],supportInst=False)

    # fur elise - 1 and 13 supporting channels
    # 12 potential main channel
    # 
# under the sea main channels = 2, 13, 4, not 12....


