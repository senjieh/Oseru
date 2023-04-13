import os
import mido
from mido import MidiFile, MidiTrack
import shutil
import binascii
# open midi file in Hex
# parse through all the  messages in hex. 
# for messages that are not in self.supportInstChannel -> change message velocity to 0   

def modMidFile(mainInstChannels, file, outPath):
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
            print("Channel ",x," greater than 15! Not recognized.")
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

def newMidiFile(mainInstChannels, file, inPath, outPath):
    """Creates a new midi file that converts the velocitys of all the note ons for the main channel to 0.
    This essentially converts them to note-offs and they don't play aloud."""
    readFile = inPath + file
    outFile = outPath + file
    noteOnRange = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159]

    # convert our main channel list into decimal as above
    # so 0x9<channel>
    mainChannelDec = []
    for x in mainInstChannels:
        hexval = "0x9"
        if x < 9:
            hexval += str(x)
        elif x == 10:
            hexval += "A"
        elif x == 11:
            hexval += "B"
        elif x == 12:
            hexval += "C"
        elif x == 13:
            hexval += "D"
        elif x == 14:
            hexval += "E"
        elif x == 15:
            hexval += "F"
        else:
            print("Channel greater than 15! Not recognized.")
        dec = int(hexval,16)
        mainChannelDec.append(dec)

    toBeDel = []
    with open(readFile, "rb") as f:
            buff = f.read()
            hexR = ("{:02x}".format(c) for c in buff)
            hex_list = list(hexR)
            listLen = len(hex_list)
            for x in range(0, listLen, 1):
                intx = int(hex_list[x], 16)
                if intx in mainChannelDec:
                    toBeDel.append(x+2)
    f.close()
    
    for x in range((len(toBeDel)-1),-1,-1):
        hex_list[(toBeDel[x])] = '00'

    with open(outFile, "wb") as fout:
        for i in hex_list:
            fout.write(binascii.unhexlify(i))
    fout.close()

def playMidi(file, filepath):
    midiFile = filepath + file
    mid = mido.MidiFile(midiFile)
    
    with mido.open_output('IAC Driver Bus 1') as port:
        for msg in mid.play():
            if (msg.type == 'note_on' or msg.type == 'note_off'):
                print(msg)
                port.send(msg)

if __name__ == "__main__":
    #playMidi("SilentNight.mid","modmidi/")
    #pass
    #obj = modMidi("SilentNight","midifiles/")

    newMidiFile([0,2],"SilentNight.mid","midifiles/","test/")
    #playMidi("SilentNight_new.mid","modmidi/")
    #obj.modMidFile([0],"modmidi/")

