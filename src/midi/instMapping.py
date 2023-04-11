# Mapping MIDI Channel Program to its instruments

def getInstClass(program):
	for key, values in instrument_class.items():
		if program in values:
			return key

instrument_class = {
	"Piano" : [1,2,3,4,5,6,7,8],
	"Chromatic Percussion" : [9,10,11,12,13,14,15,16],
	"Organ" : [17,18,19,20,21,22,23,24],
	"Guitar" : [25,26,27,28,29,30,31,32],
	"Bass" : [33,34,35,36,37,38,39,40],
	"Strings" : [41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56],
	"Brass" : [57,58,59,60,61,62,63,64],
	"Reed" : [65,66,67,68,69,70,71,72],
	"Pipe" : [73,74,75,76,77,78,79,80],
	"Synth Lead" : [81,82,83,84,85,86,87,88],
	"Synth Pad" : [89,90,91,92,93,94,95,96],
	"Synth Effects" : [97,98,99,100,101,102,103,104],
	"Ethnic" : [105,106,107,108,109,110,111,112],
	"Percussive" : [113,114,115,116,117,118,119],
	"Sound Effects" : [120,121,122,123,124,125,126,127,128]	
}