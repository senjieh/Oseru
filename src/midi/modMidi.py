import os
# open midi file in Hex
# parse through all the  messages in hex. 
# for messages that are not in self.supportInstChannel -> change message velocity to 0   

class modMidi():

    def __init__(self, songTitle, directory):
        self.songTitle = songTitle
        self.directory = directory

    def modMidFile(self, mainInstChannels):
        """ To modify the midi file we need (1) the name of the MIDI file and (2) information about the main channels we want to mute."""
        #step 1 copy midi file from unmod midi file folder to midiFiles
        
        midiFile = self.directory + str(self.songTitle) + ".mid"
        noteOnRange = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159]
        print(noteOnRange)
        numBytes = 0

        with open(midiFile, "rb") as f:
            mByte = f.read(1)
            while mByte:
                numBytes += 1
                mByte = f.read(1)
                reduced = repr(mByte)[4:-1]
                if reduced != "":
                    bInt = int(reduced, 16)
                    if bInt in noteOnRange:
                        print(bInt, numBytes)
                        with open(midiFile, "wb") as wf:
                            wf.seek(numBytes+2)
                            wf.write(bytes((00,)))
                            wf.close()
                        break
        f.close()

    def newMidiFile(self, mainInstChannel):
        readFile = "midifiles/" + str(self.songTitle) + ".mid"
        noteOnRange = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159]
        outFile = "modMidiFiles/" + str(self.songTitle) + "_mod.mid"

if __name__ == "__main__":
    pass
    #obj = modMidi("SilentNight")
    #obj.modMidFile()

