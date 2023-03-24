import unittest
import midiReader as mr
import modMidi as mod
import onUpload as up
import mido

testingPool = ["DrDre-StillDre", "He'sAPirate", "MichaelJackson-BillieJean", "SilentNight", "UnderTheSea-LittleMermaid", "BackStreetBoys-IWantItThatWay", "Beethoven-MoonlightSonata", "GunsnRoses-SweetChildOMine", "RedHotChiliPeppers-Californication"]

simpleMidi = testingPool[3]
complexMidi = testingPool[4]

class MidiTests(unittest.TestCase):

    def testInstList_simpleMidi(self):
        pass

    def testInstList_complexMidi(self):
        pass

    def testDetMainChannel_simpleMidi(self):
        midiObj = mr.midi2Array(songTitle=simpleMidi)
        midiObj.determineMainChannel()
        self.assertEquals(midiObj.mainInstChannel, [2])

    def testDetMainChannel_complexMidi(self):
        midiObj = mr.midi2Array(songTitle=complexMidi)
        midiObj.determineMainChannel()
        self.assertEquals(midiObj.mainInstChannel, [2, 4, 13])

    def testMidi2Array_simpleMidi(self):
        midiObj = mr.midi2Array(songTitle=simpleMidi)
        midiObj.midiToArray([2])
        # to test json output correct
        # open json file, check that all messages are from channel 2
        

    def testMidi2Array_complexMidi(self):
        midiObj = mr.midi2Array(songTitle=simpleMidi)
        midiObj.midiToArray([2, 4, 13])
        # to test json output correct
        # open json file, check that all messages are from channel 2, 4, or 13

    def testModMidi_simpleMidi(self):
        midiFile = "midifiles/" + str(simpleMidi) + ".mid"
        for msg in mido.MidiFile(midiFile):
            if msg.type == 'note_on' and msg.channel == 2:
                return False
        return True

    def testModMidi_complexMidi(self):
        midiFile = "midifiles/" + str(complexMidi) + ".mid"
        for msg in mido.MidiFile(midiFile):
            if msg.type == 'note_on' and msg.channel in [2,4,13]:
                return False
                #assert that velocity equal 0
            # might rewrite to just create a new file without that note?

    def testOnUpload_simpleMidi(self):
        pass
        # this function integrates the test main channel function with the modMidi function.

        #midiObj = mr.midi2Array(songTitle=simpleMidi)
        #mainChannel = midiObj.determineMainChannel()
        #mod.modMidFile(mainChannel)
        #midiFile = "midifiles/" + str(simpleMidi) + ".mid"
        #for msg in mido.MidiFile(midiFile):
        #    if msg.type == 'note_on' and msg.channel == 2:
        #        return False
        #return True

    def testMainChannelthenMod_complexMidi(self):
        pass

    def testInChannelList(self):
        # white box test
        # testing - inChannelList(self, channelList, channel, inst)
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

    def testGetChannelListLoc(self):
        # white box test
        # testing - getChannelListLoc(self, channelList, channel, inst)
        # channelList format is an array of channelInfo objects where the values are (channel, inst, noteCount)
        # for this test noteCount is irrelevant
        channelList = []
        channelList.append(mr.channelInfo(1, 5, 6))
        channelList.append(mr.channelInfo(8, 5, 17))
        channelList.append(mr.channelInfo(10, 27, 6))
        channelList.append(mr.channelInfo(3, 2, 1))
        channelList.append(mr.channelInfo(3, 48, 1))
        self.assertEquals(4, mr.getChannelListLoc(channelList, 3, 48))
        self.assertEquals(0, mr.getChannelListLoc(channelList, 1, 5))
        self.assertEquals(-1, mr.getChannelListLoc(channelList, 5, 48))
        self.assertEquals(-1, mr.getChannelListLoc(channelList, 1, 27))
        self.assertEquals(-1, mr.getChannelListLoc(channelList, 13, 30))

# BLACK-BOX TESTS
# test 1 - test instlist on simple MIDI File
# test 2 - test instlist on complex MIDI File
# test 3 - test determineMainChannel on simple MIDI File
# test 4 - test determineMainChannel on complex MIDI File
# test 5 - test Midi2Array on simple MIDI File - check num notes in JSON = num notes in MIDI
# test 6 - test Midi2Array on complex MIDI File
# test 7 - test modMIDI on MIDI File only passing in one channel to erase
# test 8 - test modMIDI on MIDI File passing in more than one channel to erase

# INTEGRATION TESTS
# test 9 - run determineMainChannel and then modMidi on simple MIDI File
    # assert all main channel messages have velocity of 0
# test 10 - run determineMainChannel and then modMidi on complex MIDI File
    # assert all main channel messages have velocity of 0
    
# WHITE-BOX TESTS
# test 11 - test inChannelList
# test 12 - test getChannelListLoc

# additional testing:

# test determineMainChannel with remaining MIDI Files.
# determine correctness with manual audio comparison.

if __name__ == "__main__":
    obj = MidiTests()

