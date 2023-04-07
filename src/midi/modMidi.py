import os
import midiReader as mr
from mido import MidiFile, MidiTrack
import shutil
# open midi file in Hex
# parse through all the  messages in hex. 
# for messages that are not in self.supportInstChannel -> change message velocity to 0   

class modMidi():

    def __init__(self, songTitle, directory):
        self.songTitle = songTitle
        self.directory = directory

    def modMidFile(self, mainInstChannels, outPath):
        """ To modify the midi file we need (1) the name of the MIDI file and (2) information about the main channels we want to mute."""
        #step 1 copy midi file from unmod midi file folder to midiFiles
        
        midiFile = self.directory + str(self.songTitle) + ".mid"

        # copy midiFile to outPath
        shutil.copy(midiFile, outPath)
        modFile = outPath + str(self.songTitle) + ".mid"

        noteOnRange = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159]

        # convert our main channel list into decimal as above
        # so 0x9<channel>
        mainChannelDec = []
        for x in mainInstChannels:
            hex = "0x9"
            if x < 9:
                hex += str(x)
            elif x == 10:
                hex += "A"
            elif x == 11:
                hex += "B"
            elif x == 12:
                hex += "C"
            elif x == 13:
                hex += "D"
            elif x == 14:
                hex += "E"
            elif x == 15:
                hex += "F"
            else:
                print("Channel greater than 15! Not recognized.")
            dec = int(hex,16)
            mainChannelDec.append(dec)

        numBytes = 0

        with open(modFile, "rb") as f:
            mByte = f.read(1)
            while mByte:
                numBytes += 1
                mByte = f.read(1)
                reduced = repr(mByte)[4:-1]
                if reduced != "":
                    bInt = int(reduced, 16)
                    if bInt in noteOnRange:
                        # then we know that it is a note-on message
                        print(bInt, numBytes)
                        #with open(midiFile, "wb") as wf:
                        #    wf.seek(numBytes+2)
                        #    wf.write(bytes((00,)))
                        #    wf.close()
                        #break
        f.close()

    def newMidiFile(self, mainInstChannels, outPath):
        readFile = self.directory + str(self.songTitle) + ".mid"
        noteOnRange = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159]

        outFile = outPath + str(self.songTitle) + "_new.mid"

        noteOnRange = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159]

        # convert our main channel list into decimal as above
        # so 0x9<channel>
        mainChannelDec = []
        for x in mainInstChannels:
            hex = "0x9"
            if x < 9:
                hex += str(x)
            elif x == 10:
                hex += "A"
            elif x == 11:
                hex += "B"
            elif x == 12:
                hex += "C"
            elif x == 13:
                hex += "D"
            elif x == 14:
                hex += "E"
            elif x == 15:
                hex += "F"
            else:
                print("Channel greater than 15! Not recognized.")
            dec = int(hex,16)
            mainChannelDec.append(dec)

        toBeDel = []
        with open(readFile, "rb") as f:
            with open(outFile, "wb") as fout:
                buff = f.read()
                hex = ("{:02x}".format(c) for c in buff)
                hex_list = list(hex)
                listLen = len(hex_list)
                for x in range(0, listLen, 1):
                    intx = int(hex_list[x], 16)
                    if intx in mainChannelDec:
                        toBeDel.append(x)
                        toBeDel.append(x+1)
                        toBeDel.append(x+2)
            fout.close()
        f.close()
        print(toBeDel)
        del hex_list[3000]
        
        for x in range(0,len(toBeDel),1):
            print(x, toBeDel[x])
            del hex_list[(toBeDel[x])]


if __name__ == "__main__":
    pass
    obj = modMidi("SilentNight","midifiles/")

    obj.newMidiFile([0],"modmidi/")

    #obj.modMidFile([0],"modmidi/")

