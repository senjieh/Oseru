import unittest
import midiReader as mr

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
        pass

    def testModMidi_complexMidi(self):
        pass

    def testMainChannelthenMod_simpleMidi(self):
        pass

    def testMainChannelthenMod_complexMidi(self):
        pass

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

