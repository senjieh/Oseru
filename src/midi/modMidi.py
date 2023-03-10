
# open midi file in Hex
# parse through all the  messages in hex. 
# for messages that are not in self.supportInstChannel -> change message velocity to 0   

class modMidi():

    def __init__(self, songTitle):
        self.songTitle = songTitle

    def modMidFile(self):
        """ To modify the midi file we need (1) the name of the MIDI file and (2) information about the main channels we want to mute."""
        midiFile = "midifiles/" + str(self.songTitle) + ".mid"
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


if __name__ == "__main__":
    obj = modMidi("SilentNight")
    obj.modMidFile()

