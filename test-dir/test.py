midi_to_note = {
    40: ('E', 2), 41: ('F', 2), 42: ('F#', 2), 43: ('G', 2), 44: ('G#', 2), 45: ('A', 2),
    46: ('A#', 2), 47: ('B', 2), 48: ('C', 3), 49: ('C#', 3), 50: ('D', 3), 51: ('D#', 3),
    52: ('E', 3), 53: ('F', 3), 54: ('F#', 3), 55: ('G', 3), 56: ('G#', 3), 57: ('A', 3),
    58: ('A#', 3), 59: ('B', 3), 60: ('C', 4), 61: ('C#', 4), 62: ('D', 4), 63: ('D#', 4),
    64: ('E', 4), 65: ('F', 4), 66: ('F#', 4), 67: ('G', 4), 68: ('G#', 4), 69: ('A', 4),
    70: ('A#', 4), 71: ('B', 4), 72: ('C', 5), 73: ('C#', 5), 74: ('D', 5), 75: ('D#', 5),
    76: ('E', 5), 77: ('F', 5), 78: ('F#', 5), 79: ('G', 5), 80: ('G#', 5), 81: ('A', 5),
    82: ('A#', 5), 83: ('B', 5), 84: ('C', 6), 85: ('C#', 6), 86: ('D', 6), 87: ('D#', 6),
    88: ('E', 6)
}

standard_tuning = ['E', 'A', 'D', 'G', 'B', 'E']

def note_to_pitch_class(note):
    pitch_classes = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}
    return pitch_classes[note]

def note_positions(note, octave):
    positions = []
    for string_num, string_note in enumerate(standard_tuning):
        fret_num = (octave - 2) * 12 + note_to_pitch_class(note) - note_to_pitch_class(string_note)
        if 0 <= fret_num <= 20:
            positions.append((string_num + 1, fret_num))
    return positions

def fretboard_distance(pos1, pos2):
    return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1])

def find_optimal_positions(midi_notes):
    prev_positions = [(0, 0)]
    optimal_positions = []

    for midi_note in midi_notes:
        note, octave = midi_to_note[midi_note]
        positions = note_positions(note, octave)
        min_distance = float('inf')
        best_position = None

        if positions:
            best_position = positions[0]

            for prev_position in prev_positions:
                for position in positions:
                    distance = fretboard_distance(prev_position, position)
                    if distance < min_distance:
                        min_distance = distance
                        best_position = position
        else:
            print(f"Note {midi_note} ({note}{octave}) cannot be played on a standard-tuned guitar.")
            continue

        optimal_positions.append(best_position)
        prev_positions = positions

    return optimal_positions

def midi_to_tab(midi_notes):
    guitar_tab = ""
    optimal_positions = find_optimal_positions(midi_notes)

    for position in optimal_positions:
        guitar_tab += f"{position[0]}({position[1]}) "
    
    return guitar_tab



midi_notes = [{"time_played": 13.5, "midi_note": 67, "frequency": 392, "note_held": 1.1015625, "velocity": 127, "channel": 2}, {"time_played": 14.625, "midi_note": 69, "frequency": 440, "note_held": 0.21484375, "velocity": 114, "channel": 2}, {"time_played": 15.0, "midi_note": 67, "frequency": 392, "note_held": 0.65625, "velocity": 117, "channel": 2}, {"time_played": 15.75, "midi_note": 64, "frequency": 329.63, "note_held": 2.10546875, "velocity": 112, "channel": 2}, {"time_played": 18.0, "midi_note": 67, "frequency": 392, "note_held": 1.0703125, "velocity": 109, "channel": 2}, {"time_played": 19.125, "midi_note": 69, "frequency": 440, "note_held": 0.27734375, "velocity": 113, "channel": 2}, {"time_played": 19.5, "midi_note": 67, "frequency": 392, "note_held": 0.62890625, "velocity": 111, "channel": 2}, {"time_played": 20.25, "midi_note": 64, "frequency": 329.63, "note_held": 1.95703125, "velocity": 111, "channel": 2}, {"time_played": 22.5, "midi_note": 74, "frequency": 587.33, "note_held": 1.32421875, "velocity": 116, "channel": 2}, {"time_played": 24.0, "midi_note": 74, "frequency": 587.33, "note_held": 0.17578125, "velocity": 113, "channel": 2}, {"time_played": 24.75, "midi_note": 71, "frequency": 493.88, "note_held": 2.17578125, "velocity": 115, "channel": 2}, {"time_played": 27.0, "midi_note": 72, "frequency": 523.25, "note_held": 1.37890625, "velocity": 114, "channel": 2}, {"time_played": 28.5, "midi_note": 72, "frequency": 523.25, "note_held": 0.12109375, "velocity": 115, "channel": 2}, {"time_played": 29.25, "midi_note": 67, "frequency": 392, "note_held": 1.63671875, "velocity": 112, "channel": 2}, {"time_played": 31.5, "midi_note": 69, "frequency": 440, "note_held": 1.3359375, "velocity": 118, "channel": 2}, {"time_played": 33.0, "midi_note": 69, "frequency": 440, "note_held": 0.1640625, "velocity": 113, "channel": 2}, {"time_played": 33.75, "midi_note": 72, "frequency": 523.25, "note_held": 1.07421875, "velocity": 121, "channel": 2}, {"time_played": 34.875, "midi_note": 71, "frequency": 493.88, "note_held": 0.05078125, "velocity": 110, "channel": 2}, {"time_played": 35.25, "midi_note": 69, "frequency": 440, "note_held": 0.609375, "velocity": 109, "channel": 2}, {"time_played": 36.0, "midi_note": 67, "frequency": 392, "note_held": 1.06640625, "velocity": 113, "channel": 2}, {"time_played": 37.125, "midi_note": 69, "frequency": 440, "note_held": 0.31640625, "velocity": 109, "channel": 2}, {"time_played": 37.5, "midi_note": 67, "frequency": 392, "note_held": 0.59765625, "velocity": 106, "channel": 2}, {"time_played": 38.25, "midi_note": 64, "frequency": 329.63, "note_held": 1.5234375, "velocity": 113, "channel": 2}, {"time_played": 40.5, "midi_note": 69, "frequency": 440, "note_held": 1.359375, "velocity": 115, "channel": 2}, {"time_played": 42.0, "midi_note": 69, "frequency": 440, "note_held": 0.140625, "velocity": 117, "channel": 2}, {"time_played": 42.75, "midi_note": 72, "frequency": 523.25, "note_held": 0.7578125, "velocity": 109, "channel": 2}, {"time_played": 43.5, "midi_note": 71, "frequency": 493.88, "note_held": 0.65625, "velocity": 109, "channel": 2}, {"time_played": 44.25, "midi_note": 69, "frequency": 440, "note_held": 0.61328125, "velocity": 111, "channel": 2}, {"time_played": 45.0, "midi_note": 67, "frequency": 392, "note_held": 1.01953125, "velocity": 107, "channel": 2}, {"time_played": 46.125, "midi_note": 69, "frequency": 440, "note_held": 0.30078125, "velocity": 112, "channel": 2}, {"time_played": 46.5, "midi_note": 67, "frequency": 392, "note_held": 0.58984375, "velocity": 111, "channel": 2}, {"time_played": 47.25, "midi_note": 64, "frequency": 329.63, "note_held": 1.5, "velocity": 112, "channel": 2}, {"time_played": 49.5, "midi_note": 74, "frequency": 587.33, "note_held": 1.38671875, "velocity": 117, "channel": 2}, {"time_played": 51.0, "midi_note": 74, "frequency": 587.33, "note_held": 0.11328125, "velocity": 115, "channel": 2}, {"time_played": 51.75, "midi_note": 77, "frequency": 698.46, "note_held": 0.65234375, "velocity": 112, "channel": 2}, {"time_played": 52.5, "midi_note": 74, "frequency": 587.33, "note_held": 0.09765625, "velocity": 109, "channel": 2}, {"time_played": 53.25, "midi_note": 71, "frequency": 493.88, "note_held": 0.11328125, "velocity": 111, "channel": 2}, {"time_played": 54.0, "midi_note": 72, "frequency": 523.25, "note_held": 2.2578125, "velocity": 115, "channel": 2}, {"time_played": 56.25, "midi_note": 76, "frequency": 659.25, "note_held": 1.44921875, "velocity": 112, "channel": 2}, {"time_played": 58.5, "midi_note": 72, "frequency": 523.25, "note_held": 0.734375, "velocity": 116, "channel": 2}, {"time_played": 59.25, "midi_note": 67, "frequency": 392, "note_held": 0.015625, "velocity": 112, "channel": 2}, {"time_played": 60.0, "midi_note": 64, "frequency": 329.63, "note_held": 0.6796875, "velocity": 113, "channel": 2}, {"time_played": 60.75, "midi_note": 67, "frequency": 392, "note_held": 0.66015625, "velocity": 113, "channel": 2}, {"time_played": 61.5, "midi_note": 65, "frequency": 349.23, "note_held": 0.7109375, "velocity": 107, "channel": 2}, {"time_played": 62.25, "midi_note": 62, "frequency": 293.66, "note_held": 0.75390625, "velocity": 115, "channel": 2}, {"time_played": 63.0, "midi_note": 60, "frequency": 261.63, "note_held": 3.61328125, "velocity": 117, "channel": 2}, {"time_played": 67.5, "midi_note": 67, "frequency": 392, "note_held": 1.078125, "velocity": 105, "channel": 2}, {"time_played": 67.5, "midi_note": 64, "frequency": 329.63, "note_held": 1.08203125, "velocity": 111, "channel": 2}, {"time_played": 68.625, "midi_note": 69, "frequency": 440, "note_held": 0.36328125, "velocity": 105, "channel": 2}, {"time_played": 68.625, "midi_note": 65, "frequency": 349.23, "note_held": 0.375, "velocity": 96, "channel": 2}, {"time_played": 69.0, "midi_note": 64, "frequency": 329.63, "note_held": 0.58203125, "velocity": 102, "channel": 2}, {"time_played": 69.0, "midi_note": 67, "frequency": 392, "note_held": 0.65625, "velocity": 106, "channel": 2}, {"time_played": 69.75, "midi_note": 60, "frequency": 261.63, "note_held": 2.109375, "velocity": 112, "channel": 2}, {"time_played": 69.75, "midi_note": 64, "frequency": 329.63, "note_held": 2.15625, "velocity": 109, "channel": 2}, {"time_played": 72.0, "midi_note": 67, "frequency": 392, "note_held": 0.9921875, "velocity": 110, "channel": 2}, {"time_played": 72.0, "midi_note": 64, "frequency": 329.63, "note_held": 1.0, "velocity": 108, "channel": 2}, {"time_played": 73.125, "midi_note": 65, "frequency": 349.23, "note_held": 0.23046875, "velocity": 100, "channel": 2}, {"time_played": 73.125, "midi_note": 69, "frequency": 440, "note_held": 0.23046875, "velocity": 104, "channel": 2}, {"time_played": 73.5, "midi_note": 64, "frequency": 329.63, "note_held": 0.625, "velocity": 103, "channel": 2}, {"time_played": 73.5, "midi_note": 67, "frequency": 392, "note_held": 0.63671875, "velocity": 109, "channel": 2}, {"time_played": 74.25, "midi_note": 64, "frequency": 329.63, "note_held": 1.89453125, "velocity": 107, "channel": 2}, {"time_played": 74.25, "midi_note": 60, "frequency": 261.63, "note_held": 1.921875, "velocity": 105, "channel": 2}, {"time_played": 76.5, "midi_note": 74, "frequency": 587.33, "note_held": 1.3359375, "velocity": 105, "channel": 2}, {"time_played": 76.5, "midi_note": 71, "frequency": 493.88, "note_held": 1.36328125, "velocity": 109, "channel": 2}, {"time_played": 78.0, "midi_note": 74, "frequency": 587.33, "note_held": 0.61328125, "velocity": 109, "channel": 2}, {"time_played": 78.0, "midi_note": 71, "frequency": 493.88, "note_held": 0.13671875, "velocity": 106, "channel": 2}, {"time_played": 78.75, "midi_note": 65, "frequency": 349.23, "note_held": 2.0625, "velocity": 105, "channel": 2}, {"time_played": 78.75, "midi_note": 71, "frequency": 493.88, "note_held": 2.1796875, "velocity": 114, "channel": 2}, {"time_played": 81.0, "midi_note": 72, "frequency": 523.25, "note_held": 1.2734375, "velocity": 109, "channel": 2}, {"time_played": 81.0, "midi_note": 64, "frequency": 329.63, "note_held": 1.3046875, "velocity": 111, "channel": 2}, {"time_played": 82.5, "midi_note": 64, "frequency": 329.63, "note_held": 0.1953125, "velocity": 108, "channel": 2}, {"time_played": 82.5, "midi_note": 72, "frequency": 523.25, "note_held": 0.65234375, "velocity": 108, "channel": 2}, {"time_played": 83.25, "midi_note": 67, "frequency": 392, "note_held": 2.01171875, "velocity": 116, "channel": 2}, {"time_played": 83.25, "midi_note": 64, "frequency": 329.63, "note_held": 2.05078125, "velocity": 105, "channel": 2}, {"time_played": 85.5, "midi_note": 69, "frequency": 440, "note_held": 1.38671875, "velocity": 109, "channel": 2}, {"time_played": 85.5, "midi_note": 60, "frequency": 261.63, "note_held": 1.41015625, "velocity": 106, "channel": 2}, {"time_played": 87.0, "midi_note": 60, "frequency": 261.63, "note_held": 0.08984375, "velocity": 113, "channel": 2}, {"time_played": 87.0, "midi_note": 69, "frequency": 440, "note_held": 0.6484375, "velocity": 113, "channel": 2}, {"time_played": 87.75, "midi_note": 72, "frequency": 523.25, "note_held": 0.9765625, "velocity": 110, "channel": 2}, {"time_played": 87.75, "midi_note": 65, "frequency": 349.23, "note_held": 2.05859375, "velocity": 113, "channel": 2}, {"time_played": 88.875, "midi_note": 71, "frequency": 493.88, "note_held": 0.05859375, "velocity": 105, "channel": 2}, {"time_played": 89.25, "midi_note": 69, "frequency": 440, "note_held": 0.55078125, "velocity": 110, "channel": 2}, {"time_played": 90.0, "midi_note": 64, "frequency": 329.63, "note_held": 1.0546875, "velocity": 113, "channel": 2}, {"time_played": 90.0, "midi_note": 67, "frequency": 392, "note_held": 1.0546875, "velocity": 105, "channel": 2}, {"time_played": 91.125, "midi_note": 65, "frequency": 349.23, "note_held": 0.26171875, "velocity": 109, "channel": 2}, {"time_played": 91.125, "midi_note": 69, "frequency": 440, "note_held": 0.296875, "velocity": 114, "channel": 2}, {"time_played": 91.5, "midi_note": 64, "frequency": 329.63, "note_held": 0.6328125, "velocity": 105, "channel": 2}, {"time_played": 91.5, "midi_note": 67, "frequency": 392, "note_held": 0.6484375, "velocity": 108, "channel": 2}, {"time_played": 92.25, "midi_note": 64, "frequency": 329.63, "note_held": 2.03515625, "velocity": 109, "channel": 2}, {"time_played": 92.25, "midi_note": 60, "frequency": 261.63, "note_held": 2.0546875, "velocity": 107, "channel": 2}, {"time_played": 94.5, "midi_note": 69, "frequency": 440, "note_held": 1.4140625, "velocity": 114, "channel": 2}, {"time_played": 94.5, "midi_note": 60, "frequency": 261.63, "note_held": 1.421875, "velocity": 109, "channel": 2}, {"time_played": 96.0, "midi_note": 60, "frequency": 261.63, "note_held": 0.5625, "velocity": 121, "channel": 2}, {"time_played": 96.0, "midi_note": 69, "frequency": 440, "note_held": 0.078125, "velocity": 105, "channel": 2}, {"time_played": 96.75, "midi_note": 72, "frequency": 523.25, "note_held": 0.7109375, "velocity": 106, "channel": 2}, {"time_played": 96.75, "midi_note": 69, "frequency": 440, "note_held": 0.72265625, "velocity": 109, "channel": 2}, {"time_played": 97.5, "midi_note": 67, "frequency": 392, "note_held": 0.6015625, "velocity": 104, "channel": 2}, {"time_played": 97.5, "midi_note": 71, "frequency": 493.88, "note_held": 0.6328125, "velocity": 109, "channel": 2}, {"time_played": 98.25, "midi_note": 65, "frequency": 349.23, "note_held": 0.64453125, "velocity": 111, "channel": 2}, {"time_played": 98.25, "midi_note": 69, "frequency": 440, "note_held": 0.68359375, "velocity": 104, "channel": 2}, {"time_played": 99.0, "midi_note": 64, "frequency": 329.63, "note_held": 1.125, "velocity": 105, "channel": 2}, {"time_played": 99.0, "midi_note": 67, "frequency": 392, "note_held": 1.125, "velocity": 109, "channel": 2}, {"time_played": 100.125, "midi_note": 69, "frequency": 440, "note_held": 0.328125, "velocity": 101, "channel": 2}, {"time_played": 100.125, "midi_note": 65, "frequency": 349.23, "note_held": 0.34765625, "velocity": 102, "channel": 2}, {"time_played": 100.5, "midi_note": 64, "frequency": 329.63, "note_held": 0.5859375, "velocity": 105, "channel": 2}, {"time_played": 100.5, "midi_note": 67, "frequency": 392, "note_held": 0.61328125, "velocity": 111, "channel": 2}, {"time_played": 101.25, "midi_note": 64, "frequency": 329.63, "note_held": 1.42578125, "velocity": 109, "channel": 2}, {"time_played": 101.25, "midi_note": 60, "frequency": 261.63, "note_held": 1.43359375, "velocity": 104, "channel": 2}, {"time_played": 103.5, "midi_note": 74, "frequency": 587.33, "note_held": 1.3359375, "velocity": 107, "channel": 2}, {"time_played": 103.5, "midi_note": 71, "frequency": 493.88, "note_held": 1.34375, "velocity": 105, "channel": 2}, {"time_played": 105.0, "midi_note": 71, "frequency": 493.88, "note_held": 0.72265625, "velocity": 109, "channel": 2}, {"time_played": 105.0, "midi_note": 74, "frequency": 587.33, "note_held": 0.73046875, "velocity": 106, "channel": 2}, {"time_played": 105.75, "midi_note": 77, "frequency": 698.46, "note_held": 0.62109375, "velocity": 104, "channel": 2}, {"time_played": 105.75, "midi_note": 74, "frequency": 587.33, "note_held": 0.69140625, "velocity": 101, "channel": 2}, {"time_played": 106.5, "midi_note": 74, "frequency": 587.33, "note_held": 0.6484375, "velocity": 84, "channel": 2}, {"time_played": 106.5, "midi_note": 71, "frequency": 493.88, "note_held": 0.01171875, "velocity": 105, "channel": 2}, {"time_played": 107.25, "midi_note": 71, "frequency": 493.88, "note_held": 0.59765625, "velocity": 97, "channel": 2}, {"time_played": 107.25, "midi_note": 68, "frequency": 415.3, "note_held": 0.59765625, "velocity": 92, "channel": 2}, {"time_played": 108.0, "midi_note": 69, "frequency": 440, "note_held": 2.1328125, "velocity": 107, "channel": 2}, {"time_played": 108.0, "midi_note": 72, "frequency": 523.25, "note_held": 2.17578125, "velocity": 105, "channel": 2}, {"time_played": 110.25, "midi_note": 76, "frequency": 659.25, "note_held": 1.43359375, "velocity": 101, "channel": 2}, {"time_played": 110.25, "midi_note": 72, "frequency": 523.25, "note_held": 1.45703125, "velocity": 92, "channel": 2}, {"time_played": 112.5, "midi_note": 67, "frequency": 392, "note_held": 0.59765625, "velocity": 109, "channel": 2}, {"time_played": 112.5, "midi_note": 72, "frequency": 523.25, "note_held": 0.64453125, "velocity": 101, "channel": 2}, {"time_played": 113.25, "midi_note": 64, "frequency": 329.63, "note_held": 0.66796875, "velocity": 105, "channel": 2}, {"time_played": 113.25, "midi_note": 67, "frequency": 392, "note_held": 0.03125, "velocity": 109, "channel": 2}, {"time_played": 114.0, "midi_note": 60, "frequency": 261.63, "note_held": 0.0546875, "velocity": 101, "channel": 2}, {"time_played": 114.0, "midi_note": 64, "frequency": 329.63, "note_held": 0.6484375, "velocity": 107, "channel": 2}, {"time_played": 114.75, "midi_note": 59, "frequency": 246.94, "note_held": 0.6339264583333346, "velocity": 114, "channel": 2}, {"time_played": 114.75, "midi_note": 67, "frequency": 392, "note_held": 0.6919619791666634, "velocity": 109, "channel": 2}, {"time_played": 115.60714000000002, "midi_note": 57, "frequency": 220, "note_held": 0.7678545833333175, "velocity": 109, "channel": 2}, {"time_played": 115.60714000000002, "midi_note": 65, "frequency": 349.23, "note_held": 0.8258901041666604, "velocity": 105, "channel": 2}, {"time_played": 116.46428000000002, "midi_note": 53, "frequency": 174.61, "note_held": 0.6741048958333096, "velocity": 100, "channel": 2}, {"time_played": 116.46428000000002, "midi_note": 62, "frequency": 293.66, "note_held": 0.8080330208333208, "velocity": 111, "channel": 2}, {"time_played": 117.32142, "midi_note": 52, "frequency": 164.81, "note_held": 5.567708333333314, "velocity": 111, "channel": 2}, {"time_played": 117.32142, "midi_note": 60, "frequency": 261.63, "note_held": 5.578124999999986, "velocity": 105, "channel": 2}]
just_midi_notes = [ note["midi_note"] for note in midi_notes]
guitar_tab = midi_to_tab(just_midi_notes)
print(guitar_tab)