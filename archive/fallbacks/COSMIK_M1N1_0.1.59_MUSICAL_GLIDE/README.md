# Cosmik M1N1

An in-progress, Minimoog-influenced mono voice for the Music Thing Modular
Workshop Computer. It begins from the stable C1ZZL3 Gnarly architecture, while
moving toward a two-internal-oscillator voice with an external oscillator 3
pitch/CV loop and Model D-style modulation routing.

## Current Firmware Behaviour

- Switch middle: cutoff, resonance/emphasis, contour.
- A Down press and release within half a second cycles the selected setup page:
  OSC 1, OSC 2, then external OSC 3. The selection is shown when the switch is
  moved Up.
- Switch up, OSC 1 page: Main master tune, X level, Y waveform. Main spans
  seven semitones flat to seven semitones sharp, with C3 exactly at 12 o'clock.
  The Web UI Range selector supplies its `32'`--`2'` pipe-length setting.
- Switch up, OSC 2 page: Main Frequency spans seven semitones flat to seven
  semitones sharp, X is level, and Y selects waveform. Its Web UI Range
  selector supplies the coarse `32'`--`2'` setting.
- Switch up, external OSC 3 page: Main Frequency offsets `CV Out 1` by seven
  semitones flat to seven semitones sharp, X sets the audio-return level, and
  Y selects the external oscillator's `32'`--`2'` pipe-length range.
- Switch down for less than half a second: external oscillator frequency
  offset, panel MOD DEPTH, pitch/filter destination balance. MIDI CC1 adds to
  panel MOD DEPTH without changing its stored setting. Hold Down longer than
  half a second: Main is noise level, X crosses a small noon dead zone to
  select white (anticlockwise) or pink (clockwise) noise, and Y controls MOD
  MIX from source A (anticlockwise) to source B (clockwise).
- Changing switch position uses soft pickup for all three knobs: a page keeps
  its current settings until each physical knob reaches or crosses that
  setting, avoiding jumps between pages.
- Either pulse input or a USB MIDI note drives independent amplifier and
  filter ADS contours. Release is a fixed, short de-click fade, matching the
  original ADS control concept.
- Hold Down during the first half-second after startup to enter the muted
  preset-loading mode immediately. Release Down to arm the selector, turn Main
  to choose a voice, then press and release Down a second time to load it.
- At any other time, hold Down for four seconds for the LED 4 warning, continue
  to five seconds to enter factory-preset selection, then turn Main and release
  Down to load the selected voice.
- `CV Out 1` follows the current voice pitch for an external oscillator, with
  C3 at 0 V to match the Workshop System and Keystep convention.
- `Audio Out 1` is the filtered voice and `Audio Out 2` is the pre-filter mix.

## Inputs

- `Audio In 1`: calibrated 1 V/octave pitch CV for the internal oscillators.
  An active USB MIDI note takes priority over this input for pitch.
- `Audio In 2`: external oscillator return, used as OSC 3 in the mixer.
- `CV In 1`: positive filter-cutoff modulation.
- `CV In 2`: external OSC 3 modulation output or another external modulation
  source. It is selectable as MOD SRC A or MOD SRC B in the Web UI.
- `Pulse In 1` and `Pulse In 2`: either acts as a gate for the first-pass VCA.
- USB MIDI: note on/off supplies pitch and gate; pitch bend is active.

## LED Feedback

| Switch state | LEDs |
| --- | --- |
| Middle | 0: cutoff; 2: resonance/emphasis; 4: filter contour; 1, 3, and 5: off. |
| Up | 0, 2, and 4: selected OSC 1, OSC 2, or external OSC 3. LED 1 shows OSC 2 or OSC 3 pitch deviation from centre. LEDs 3 and 5 show the selected internal waveform: dark/dark triangle; steady/dark triangle/sawtooth (sharktooth); dark/steady saw; flashing/dark square; dark/flashing wide rectangle; flashing/flashing narrow rectangle. |
| Down | 0: external OSC 3 pitch offset; 1: MOD DEPTH; 2: pitch/filter balance; 3-4: off; 5: half brightness. |
| Down held 0.5-5 seconds | 0: noise level; 1: source-B amount; 2: source-A amount; 3: white selected; 5: pink selected. LED 4 stays off until the warning. |
| Down held 4 seconds | LED 4 flashes as a warning. |
| Startup Down hold or Down held 5 seconds | LEDs 0-2 show the slot index `0-7`; LED 3 flashes as the selector cursor; LED 4 is bright for the active preset and half bright for another selectable preset. LED 5 off is factory; LED 5 on is user. Empty user slots are skipped. At startup, release the initial Down hold to arm selection, then press and release Down again to load and exit. |

`Audio Out 1` uses a four-pole, resonant ladder filter. The Web UI Mode control
selects its established low-pass output or a complementary high-pass output.
It has a division-free feedback solve and soft transistor-style stage shaping.
The Web UI exposes its cutoff, emphasis, contour, filter ADS, and Model D-style
None/1/3/2/3/Full keyboard tracking. Its Modulation Controllers select
`External OSC 3 / CV In 2` or Filter Contour as MOD SRC A, and Noise, external
MOD SOURCE, or internal LFO as MOD SRC B, then crossfade them with MOD MIX.
The LFO has triangle/square shapes and a 0.05--14 Hz rate control.
MIDI CC1 adds to MOD DEPTH, matching the role of a modulation wheel. Independent
oscillator and filter modulation enables route the mixed source. Tracking uses the current MIDI or pitch-CV
note relative to C3, so a positive setting keeps brighter notes more open.
The Web UI Glide control is preset-backed and ranges from immediate response to
an approximately two-second all-note slide. It acts on MIDI and pitch-CV base
pitch before modulation, and `CV Out 1` follows the same glide for external
OSC 3.

The oscillator pass uses a generated, zero-DC, multiband wavetable bank:
triangle, triangle/sawtooth (sharktooth), saw, square, wide rectangle, and
narrow rectangle.
Each shape has nine harmonic bands and is selected from pitch, reducing aliasing
at higher notes. OSC 1 starts as saw and OSC 2 starts as square; the panel and
Web UI waveform controls are still to be connected. This remains separate from
the inherited C1ZZL3 phase-distortion engine.

## Web Control Surface

Serve `web/` locally and open it in Chrome or Edge. The Web UI has the factory
bank and eight named card-backed user slots, plus a WebMIDI connection and
developer monitor. `Send to card` transfers the complete live voice, including
noise, both ADS contours, and keyboard tracking; card control changes are polled back
into the UI. Capturing a user slot persists those contour settings alongside
the voice. Existing user slots migrate automatically with glide at zero. The card uses the compact `MNV1` request
protocol and a reliable MIDI CC response channel for identity, user-slot
listing, capture, recall, delete, and live voice readback.

## Experimental ADS And Tracking Test

1. Flash `uf2/COSMIK_M1N1_0.1.26_EXPERIMENTAL_ADS_KEY_TRACKING.uf2`, then use
   a Keystep or DAW USB MIDI to hold a note.
2. In the Web UI, set amplifier sustain to zero, send the voice, and confirm a
   note falls to silence after its amp decay. Raise sustain and confirm the
   held level follows it. Releasing the note should remain click-free.
3. Set a high filter contour and filter sustain to zero. Confirm the held note
   opens during filter attack, then closes during filter decay while the amp
   can remain sustained.
4. With a modest cutoff and contour, compare low and high MIDI notes with
   keyboard tracking None, 1/3, 2/3, and Full. Higher notes should become
   progressively brighter at each setting; None should leave their base cutoff
   unchanged.
5. Save the edited voice to a user slot, power-cycle, recall it, and verify all
   six ADS values and tracking return in the Web UI.

## Experimental Glide Test

1. Flash `uf2/COSMIK_M1N1_0.1.59_EXPERIMENTAL_FASTER_GLIDE.uf2` and play two notes a
   fifth or octave apart from a Keystep over USB MIDI.
2. In the Web UI set Glide to `0 ms`, send the voice, and confirm each note
   changes pitch immediately. Raise Glide to about `500 ms`, send again, and
   confirm every new note slides to its pitch; `2000 ms` should be distinctly
   slower.
3. Patch `CV Out 1` to an external oscillator's pitch input and `Audio In 2`
   to its return. Confirm the external oscillator slides with the two internal
   oscillators, without a beat drifting between them.
4. Save a non-zero Glide setting to a user slot, power-cycle, recall it, and
   use the Web UI's card readback to confirm the same value returns. Recall an
   existing user slot saved before this firmware and confirm its Glide reads
   `0 ms`.

## Build

Set `PICO_SDK_PATH` to a valid Raspberry Pi Pico SDK checkout, then run:

```sh
cmake -S . -B build -DPICO_NO_PICOTOOL=1
cmake --build build -j2
```

## Provenance

The initial platform, USB MIDI host support, and lookup tables derive from
`Workshop_Computer/releases/101_Gnarly_C1ZZL3` at commit
`bf4ecbbed2f2075a6d008f2cba18f70502593b86`. The inherited code and its
licence notices remain under the MIT License.

This card gratefully uses the ComputerCard framework by Chris Johnson. The
bundled `ComputerCard.h` is the canonical ComputerCard `0.4.0` release under
the MIT License. Its calibrated audio-input path now applies to the pitch-CV
and external-audio inputs, and its scaled knob range improves access to the
full 0--4095 control travel. The firmware continues to run at 192 MHz, an
exact multiple of the 48 kHz audio rate required for the framework's
low-artifact CV PWM timing.
