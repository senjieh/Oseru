
# open midi file in Hex
# parse through all the  messages in hex. 
# for messages that are not in self.supportInstChannel -> change message velocity to 0   

class modMidi():

    def __init__(self, songTitle):
        self.songTitle = songTitle

    def modMidFile(self):
        """ To modify the midi file we need (1) the name of the MIDI file and (2) information about the main channels we want to mute."""
        
        with open("midifiles/SilentNight.mid", "rb") as f:
            header_chunk = f.read(4)
            length = f.read(4)
            next = f.read(4)

            print(header_chunk)
            print(list(header_chunk))
            print(length)
            print(list(length))
            print(next)
            print(list(next))


if __name__ == "__main__":
     print("hey")

