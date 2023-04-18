import unittest
import midiReader as mr
import modMidi as mod
import onUpload as up
import json
import mido

testingPool = ["DrDre-StillDre", "He'sAPirate", "MichaelJackson-BillieJean", "SilentNight", "UnderTheSea-LittleMermaid", "BackStreetBoys-IWantItThatWay", "Beethoven-MoonlightSonata", "GunsnRoses-SweetChildOMine", "RedHotChiliPeppers-Californication"]

simpleMidi = testingPool[3]
complexMidi = testingPool[4]

testMidi = [
    ["DrDre-StillDre.mid",[0,2],"simple"],
    ["SilentNight.mid",[],"simple"],
    ["Beethoven-FurElise.mid",[0],"simple"],
    ["GunsnRoses-SweetChildOMine.mid",[],"complex"],
    ["Zelda-SongOfStorms.mid",[0],"simple"],
    ["RedHotChiliPeppers-Californication.mid",[1],"simple"],
    ["MichaelJackson-BillieJean.mid",[2,3],"complex"]

]

# midi files without supporting inst channels just have main channel quieted for the mod midi file.


class MidiTests(unittest.TestCase):

    # note: there are a lot of tests that may look like duplicates but I am testing two types of MIDI files - 
    # the first midi file is classified as "simple", meaning that the main instrument is only on one channel.
    # the second midi file has the main instruments that we are interested in trying to get notes from on multiple channels.

    def testInChannelList(self):
        # white box test

       # def inChannelList(channelList, channel, inst):
       # """Simple method that checks whether channel+inst exists in channellist."""
       # for i in channelList:
       #     if (channel == i.channel) and (inst == i.inst):
       #         return True
       # return False

        # channelList format is an array of channelInfo objects where the values are (channel, inst, noteCount)
        # for this test noteCount is irrelevant
        channelList = []
        channelList.append(mr.channelInfo(1, 5, 6))
        channelList.append(mr.channelInfo(8, 5, 17))
        channelList.append(mr.channelInfo(10, 27, 6))
        channelList.append(mr.channelInfo(3, 2, 1))
        channelList.append(mr.channelInfo(3, 48, 1))
        self.assertTrue(mr.inChannelList(channelList, 3, 48))
        self.assertFalse(mr.inChannelList(channelList, 3, 40))
        self.assertFalse(mr.inChannelList(channelList, 2, 5))
        self.assertFalse(mr.inChannelList(channelList, 7, 7))
        # this test should yield complete coverage with some slight over-testing.

    def testGetChannelListLoc(self):
        # white box test
        
        # def getChannelListLoc(channelList, channel, inst):
        # """Simple method that returns the index of a channel+inst in list."""
        # for i in channelList:
        # if (channel == i.channel) and (inst == i.inst):
        #    return channelList.index(i)
        # return -1

        # channelList format is an array of channelInfo objects where the values are (channel, inst, noteCount)
        # for this test noteCount is irrelevant
        channelList = []
        channelList.append(mr.channelInfo(1, 5, 6))
        channelList.append(mr.channelInfo(8, 5, 17))
        channelList.append(mr.channelInfo(10, 27, 6))
        channelList.append(mr.channelInfo(3, 2, 1))
        channelList.append(mr.channelInfo(3, 48, 1))
        self.assertEqual(4, mr.getChannelListLoc(channelList, 3, 48))
        self.assertEqual(0, mr.getChannelListLoc(channelList, 1, 5))
        self.assertEqual(-1, mr.getChannelListLoc(channelList, 5, 48))
        self.assertEqual(-1, mr.getChannelListLoc(channelList, 1, 27))
        self.assertEqual(-1, mr.getChannelListLoc(channelList, 13, 30))
        # this test should yield complete coverage with some slight over-testing.

    def testDetMainChannel_simpleMidi(self):
        # black box acceptance test
        midiObj = mr.midi2Array(songTitle=simpleMidi)
        midiObj.determineMainChannel()
        self.assertEqual(midiObj.mainInstChannel, [2])
        # checks that the main channel is the main channel that I
        # determined to hold all of the main instrument notes

    def testDetMainChannel_complexMidi(self):
        # black box acceptance test
        midiObj = mr.midi2Array(songTitle=complexMidi)
        midiObj.determineMainChannel()
        self.assertEqual(midiObj.mainInstChannel, [3, 4, 13])
        # checks that the main channel is the main channels that I
        # determined to hold all of the main instrument notes

    def testInstList_Dup(self):
        # black box acceptance test
        midiObj = mr.midi2Array(songTitle=simpleMidi)
        midiObj.instList()
        outFile = "channelList/" + str(simpleMidi) + "_channels.json"
        f = open(outFile)
        data = json.load(f)
        channelAndInst = []
        for i in data:
            newVal = str(i['channel'])+","+str(i['inst'])
            channelAndInst.append(newVal)
        self.assertEqual(len(set(channelAndInst)), len(channelAndInst))
        f.close()
        # this assert statement checks that there are no duplicate channel and inst combos
        # in the channelList json file.

    def testInstList_NoteCount(self):
        # black box acceptance test
        midiObj = mr.midi2Array(complexMidi)
        midiObj.instList()
        outFile = "channelList/" + str(complexMidi) + "_channels.json"
        f = open(outFile)
        data = json.load(f)
        sumNotes = 0
        for i in data:
            sumNotes += i['noteCount']
        self.assertEqual(sumNotes, midiObj.totalNotes)
        f.close()
        # this assert statement checks that the total sum of the note counts in the JSON
        # is equivalent to the total sum of notes counted in the program.

    def testMidi2Array_simpleMidi(self):
        # black box acceptance test
        midiObj = mr.midi2Array(songTitle=simpleMidi)
        midiObj.midiToArray([2])
        outFile = "jsonMidi/" + str(simpleMidi) + ".json"
        f = open(outFile)
        data = json.load(f)
        for i in data:
            self.assertEqual(2, i[5])

        f.close()
        # checks that every single item in the music array comes from channel 2, 
        # the main instrument channel in this midi file.
        
    def testMidi2Array_complexMidi(self):
        # black box acceptance test
        midiObj = mr.midi2Array(songTitle=complexMidi)
        midiObj.midiToArray([2, 4, 13])
        outFile = "jsonMidi/" + str(complexMidi) + ".json"
        f = open(outFile)
        data = json.load(f)
        for i in data:
            self.assertIn(i[5], [2, 4, 13])

        f.close()
        # checks that every single item in the music array comes from  
        # the main instrument channels in this midi file.

    def testModMidi_simpleMidi(self):
        # black box acceptance test
        midiFile = "modMidiFiles/" + str(simpleMidi) + ".mid"
        obj = mod.modMidi(simpleMidi, "modMidiFiles/")
        obj.modMidFile([2])
        for msg in mido.MidiFile(midiFile):
            if msg.type == 'note_on' and msg.channel == 2:
                self.assertEqual(msg.velocity, 0)
        # asserts that the velocity for a main channel note was changed to 0

    def testModMidi_complexMidi(self):
        # black box acceptance test
        midiFile = "modMidiFiles/" + str(complexMidi) + ".mid"
        obj = mod.modMidi(complexMidi, "modMidiFiles/")
        mainChannels = [2, 3, 14]
        obj.modMidFile(mainChannels)
        for msg in mido.MidiFile(midiFile):
            if msg.type == 'note_on' and msg.channel in mainChannels:
                self.assertEqual(msg.velocity, 0)
        # asserts that the velocity for a main channel note was changed to 0.
        # similar to above test except this test is for a more complex midi file with multiple main channels.

    def testNewMidi_simpleMidi(self):
        # black box acceptance test
        midiFile = "modMidiFiles/" + str(simpleMidi) + "_mod.mid"
        obj = mod.modMidi(simpleMidi, "modMidiFiles/")
        obj.newMidiFile([2])
        for msg in mido.MidiFile(midiFile):
            if msg.type == 'note_on':
                self.assertNotEqual(msg.channel, 2)
        # function newMidiFile not fully implemented yet
        # test for a function that instead of modifying a midi file creates an entirely new one.
        # not implemented yet, will get a file not found error

    def testMainChannelthenMod_simpleMidi(self):
        # integration test
        arrObj = mr.midi2Array(songTitle=simpleMidi)
        mainChannels = arrObj.determineMainChannel()
        modObj = mod.modMidi(simpleMidi, "modMidiFiles/")
        modObj.modMidFile(mainChannels)
        midiFile = "modMidiFiles/" + str(simpleMidi) + ".mid"
        for msg in mido.MidiFile(midiFile):
            if msg.type == 'note_on':
                self.assertNotIn(msg.channel, mainChannels)
        # this function integrates the determineMainChannel function from the midiReader class with the modMidi function from the modMidi class.
        # similar to below test except below test is testing a complex midi file with multiple main channels,
        # and this function tests a simple midi file with only one main channel.
        # big bang testing method

    def testMainChannelthenMod_mj(self):
         # integration test
        arrObj = mr.midi2Array(songTitle=testingPool[2])
        mainChannels = arrObj.determineMainChannel()
        modObj = mod.modMidi(testingPool[2], "modMidiFiles/")
        modObj.modMidFile(mainChannels)
        midiFile = "modMidiFiles/" + str(testingPool[2]) + ".mid"
        for msg in mido.MidiFile(midiFile):
            if msg.type == 'note_on':
                self.assertNotIn(msg.channel, mainChannels)
        # this function integrates the determineMainChannel function from the midiReader class with the modMidi function from the modMidi class.
        # testing on a more complex midi file with multiple main channels.
        # big bang testing method

    def testOnUploadthenSelect_simpleMidi(self):
        pass


