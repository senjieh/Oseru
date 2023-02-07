# simple script written to take combine the midi to note and note to frequency dictionaries
# outputs a midi to frequency dictionary to a text file
# NO LONGER NEED! - the midi to frequency dictionary has been copied to midi_noteMapping.py and can be accessed from there
# including this file for the sole purpose of proof of work/code

import midi_noteMapping as md

MIDI_to_frequency = dict()

for midi in md.MIDI_to_note:
	note = md.MIDI_to_note[midi]
	freq = md.note_to_frequency[note]
	MIDI_to_frequency[midi] = freq

file = open("midi_to_freq.txt", 'wt')
data = str(MIDI_to_frequency)
file.write(data)