import mido
import os
import midiMapping as mm
import instMapping as im
import midiArray as mr
import modMidi as mod

class channelInst():
    def __init__(self, channel, inst, msgCount):
        self.channel = channel
        self.inst = inst
        self.msgCount = msgCount

class handleMIDI():

    def __init__(self, file):
        """ This class is used to determine the main channel / channel of the MIDI file.
        It first determines whether the MIDI file is simple or complicated, and tracks the
        main instruments / channels accordingly."""
        self.file = file

    def determineMethod(self):
        mainInstChannel, supportInstChannel = self.mainChannelSimple()
        instList = self.channelInstList()
       # print("main: ",mainInstChannel)
       # print("support: ",supportInstChannel)
       # for x in range(0,len(instList),1):
       #    print(instList[x].channel, instList[x].inst, instList[x].msgCount)

        if (len(mainInstChannel) + len(supportInstChannel)) == 0:
            print("No Channels Found")
            return -1
    
        # this is the case for when midi has no channel switches
        elif (len(mainInstChannel) + len(supportInstChannel)) == len(instList):
            
            # now we need to add a check for if any of the channels have the same instrument.
            moveToMain = []
            for y in mainInstChannel:
                for x in supportInstChannel:
                    for i in range(0,len(instList),1):
                        if instList[i].channel == x:
                            xIndex = i
                        if instList[i].channel == y:
                            yIndex = i
                    if instList[xIndex].inst == instList[yIndex].inst:
                        moveToMain.append(x)
            print("Move to main", moveToMain)
            #need to add a check to make sure that one channel will stay in supporting instrument.
            for y in moveToMain:
                mainInstChannel.append(y)
                supportInstChannel.remove(y)
            
            return True, mainInstChannel, instList
        
        # case for when midi has channel switches and is more complicated
        elif (len(mainInstChannel) + len(supportInstChannel)) != len(instList):
            return False, mainInstChannel, instList
        
        else:
            print("Error - no method determined.")
            return -1

    def mainChannelComplex(self, instList, mainChannelList):
        tier1inst = ["Piano", "Guitar", "Strings"]
        tier2inst = ["Chromatic Percussion", "Synth Lead","Organ"]

        mainChannelList = []
        backupChannel = []

        for x in instList:
            inst = im.getInstClass(x.inst)
            if inst in tier1inst:
                mainChannelList.append(x)
            elif inst in tier2inst:
                backupChannel.append(x)

        for x in mainChannelList:
            print(x.channel, x.inst, x.msgCount)
        for x in backupChannel:
            print(x.channel, x.inst, x.msgCount)
        
    # given inst-list, we need to determine when the channels hold the important instrumetns,
    # and when these times occur. need to figure out a way for modmidi and tojson to handle channel switching.
    # also weight in the result of mainChannelList

    def mainChannelSimple(self):
        """ Returns an array that contains the main channel(s) on which the primary instrument will be played and
        assigns all other channels to be supporting instrument channels."""
        mid = mido.MidiFile(self.file)
        noteCount = {}
        mainInstChannel = []
        supportInstChannel = []
        backupChannel = []
        freqSum = {}
        freqAvg = {}
        # what to do for cases when instrument range is from 0 -127 instead of 1-128

        tier1inst = ["Piano", "Guitar", "Strings"]
        tier2inst = ["Chromatic Percussion", "Synth Lead","Organ"]
        for msg in mid:
            if msg.type == 'note_on' or msg.type == 'note_off':
                if msg.channel not in noteCount:
                    noteCount[msg.channel] = 1
                else:
                    prevCount = noteCount[msg.channel]
                    noteCount[msg.channel] = prevCount + 1
                if msg.channel not in freqSum:
                    freqSum[msg.channel] = msg.velocity
                else:
                    prevAvg = freqSum[msg.channel]
                    freqSum[msg.channel] = prevAvg + msg.velocity
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

        for key in freqSum:
            freqAvg[key] = freqSum[key] / noteCount[key]

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
            loudestNotes = 0
            mostNChannel = 0
            loudNChannel = 0
            for i in mainInstChannel:
                if noteCount[i] > mostNotes:
                    mostNotes = noteCount[i]
                    mostNChannel = i
                if freqAvg[i] > loudestNotes:
                    loudestNotes = freqAvg[i]
                    loudNChannel = i
            
            leadChannel = 0
            if (freqAvg[loudNChannel] - freqAvg[mostNChannel]) > 10:
                leadChannel = loudNChannel
            else:
                leadChannel = mostNChannel

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

    def getChannelListLoc(channelList, channel, inst):
        """Simple method that returns the index of a channel+inst in list."""
        for i in channelList:
            if (channel == i.channel) and (inst == i.inst):
                return channelList.index(i)
        return -1
    
    def inChannelList(channelList, channel, inst):
        """Simple method that checks whether channel+inst exists in channellist."""
        for i in channelList:
            if (channel == i.channel) and (inst == i.inst):
                return True
        return False

    def channelInstList(self):
        """ Returns a sorted list of when the channels switch instruments.
        The list contains values of the class ChannelInst, with a value for msg.channel, 
        msg.program (instrument), and msgCount."""
        mid = mido.MidiFile(self.file)
        channelList = []
        channelWMsgList = []
        msgCount = 0

        for msg in mid:
            msgCount += 1
            if msg.type == 'program_change':
                channelList.append(channelInst(msg.channel, msg.program, msgCount))
            if msg.type == 'note_on' and msg.channel not in channelWMsgList:
                channelWMsgList.append(msg.channel)

        for x in range(0,len(channelList),1):
            print(channelList[x].channel, channelList[x].inst, channelList[x].msgCount)
        # sort order should be by channel, then by msgcount.
        channelList.sort(key=lambda x: x.channel)
        curChannel = -1
        toBeDel = []
        for x in range(0,len(channelList),1):
            if channelList[x].channel not in channelWMsgList:
                toBeDel.append(x)
            if curChannel != channelList[x].channel:
                curChannel = channelList[x].channel
            elif curChannel == channelList[x].channel:
                if channelList[x].inst == channelList[x-1].inst:
                    toBeDel.append(x)

        for i in range((len(toBeDel)-1), -1, -1):
            del channelList[toBeDel[i]]
        
        return channelList

def isValid(file):
    if not os.path.isfile(file):
        return False
    return True

if __name__ == "__main__":
    inPath = "midifiles/"
    arrayOut = "jsonMidi/"
    modOut = "modmidi/"

    # how will midi file be given?
    midiFile = "Beethoven-FurElise.mid"

    valid = isValid(inPath+midiFile)
    if valid:
        obj = handleMIDI(inPath+midiFile)
        simple, mainChannelList, instList = obj.determineMethod()
        print("main: ",mainChannelList)
        for x in range(0,len(instList),1):
           print(instList[x].channel, instList[x].inst, instList[x].msgCount)

        if simple:
            print("file is simple!")
            check = mr.midiToArray(midiFile, inPath, "jsonMidi/", mainChannelList, createJson=True)
            if check == 0:
                mod.newMidiFile(mainChannelList, midiFile, inPath, "modmidi/")
            #mod.playMidi(midiFile, "modmidi/")
        else:
            print("file is complex!")
            #obj.mainChannelComplex(instList, mainChannelList)
            #check = mr.midiToArrayComplicated(midiFile, inPath, "jsonMidi/", mainChannelList, InstList, createJson=False)
            #if check == 0:
            #   mod.newMidiComplicated(mainChannelList, instList, midiFile, inPath, "modmidi/")

    else:
        print("Error: File not Found.")
        # return an error to the user that file was not uploaded properly 


# FILES

# DrDre-StillDre DONE
# SilentNight DONE
# RHCP Californication - needs work
# beethoven 0, 5, C, 