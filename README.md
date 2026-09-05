# Minimoog Voice

An in-progress, Minimoog-influenced mono voice for the Music Thing Modular
Workshop Computer. It begins from the stable C1ZZL3 Gnarly architecture, while
moving toward a two-internal-oscillator voice with an external oscillator 3
pitch/CV loop and external-LFO modulation.

## Current Firmware Behaviour

- Switch middle: cutoff, oscillator mixer, contour. The X control scans from
  oscillator 1 at the left, through all three oscillators together at noon, to
  the external oscillator 3 return at the right.
- A Down press and release within half a second cycles the selected setup page:
  OSC 1, OSC 2, then external OSC 3. The selection is shown when the switch is
  moved Up.
- Switch up, OSC 1 page: Main range/pitch, X level, Y waveform.
- Switch up, OSC 2 page: Main interval/range, X level, Y waveform. Fine tune
  remains at its current value until it moves to the Web UI.
- Switch up, external OSC 3 page: Main `CV Out 1` pitch offset, X audio-return
  level, Y future external output role. The role selector has no hardware
  behaviour yet.
- Switch down: external oscillator pitch offset, external LFO depth, pitch/filter destination blend.
- Changing switch position uses soft pickup for all three knobs: a page keeps
  its current settings until each physical knob reaches or crosses that
  setting, avoiding jumps between pages.
- Either pulse input or a USB MIDI note drives the first-pass VCA/gate.
- Holding down for four seconds flashes LED 5 as a warning; at five seconds the
  Main knob previews one of eight future sound-preset slots without changing
  the current voice.
- `CV Out 1` follows the current voice pitch for an external oscillator.
- `Audio Out 1` is the filtered voice and `Audio Out 2` is the pre-filter mix.

## Inputs

- `Audio In 1`: pitch CV for the internal oscillators. An active USB MIDI note
  takes priority over this input for pitch.
- `Audio In 2`: external oscillator return, used as OSC 3 in the mixer.
- `CV In 1`: positive filter-cutoff modulation.
- `CV In 2`: external LFO input. Its depth and pitch/filter destination are
  set on the Down page.
- `Pulse In 1` and `Pulse In 2`: either acts as a gate for the first-pass VCA.
- USB MIDI: note on/off supplies pitch and gate; pitch bend is active.

## LED Feedback

| Switch state | LEDs |
| --- | --- |
| Middle | 0: OSC 1 mix level; 1: cutoff; 2: OSC 2 mix level; 3: contour; 4: external OSC 3 mix level; 5: half brightness. At X centre, 0, 2, and 4 are all bright. |
| Up | 0, 2, and 4: selected OSC 1, OSC 2, or external OSC 3. LED 1 shows OSC 2 or OSC 3 pitch deviation from centre. LEDs 3 and 5 show the selected internal waveform: dark/dark triangle; steady/dark triangle/sawtooth (sharktooth); dark/steady saw; flashing/dark square; dark/flashing wide rectangle; flashing/flashing narrow rectangle. |
| Down | 0: external OSC 3 pitch offset; 1: external-LFO depth; 2: LFO pitch/filter balance; 3-4: off; 5: half brightness. |
| Down held 4 seconds | LED 5 flashes as a warning. |
| Down held 5 seconds | LEDs 0-2 show a future preset slot in binary; LED 5 is fully lit. This is currently a non-destructive preview and changes no sound. |

The filter is currently a stable four-stage low-pass placeholder. Its detailed
ladder saturation and envelope design remain the next hardware-led work.

The oscillator pass uses a generated, zero-DC, multiband wavetable bank:
triangle, triangle/sawtooth (sharktooth), saw, square, wide rectangle, and
narrow rectangle.
Each shape has nine harmonic bands and is selected from pitch, reducing aliasing
at higher notes. OSC 1 starts as saw and OSC 2 starts as square; the panel and
Web UI waveform controls are still to be connected. This remains separate from
the inherited C1ZZL3 phase-distortion engine.

## Web Control Surface

Open `web/index.html` in a browser. This first screen is deliberately a visual
parameter map, not yet a WebMIDI transport. It includes every planned voice,
mixer, filter, contour, modulation, and patch-point control so their grouping
can be decided in context.

## Next Stage

The work staged in [FUTURE_PLANS.md](FUTURE_PLANS.md) covers waveform choices
in the Web UI, an individual three-oscillator mixer, amp and filter envelopes,
MIDI integration, and sound presets. The current long-hold LED state is only a
non-destructive placeholder until those presets save and recall complete voice
states.

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
