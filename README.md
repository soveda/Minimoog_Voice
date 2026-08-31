# Minimoog Voice

An in-progress, Minimoog-influenced mono voice for the Music Thing Modular
Workshop Computer. It begins from the stable C1ZZL3 Gnarly architecture, while
moving toward a two-internal-oscillator voice with an external oscillator 3
pitch/CV loop and external-LFO modulation.

## First Firmware Pass

- Switch middle: cutoff, oscillator mixer, contour. The X control scans from
  oscillator 1 at the left, through all three oscillators together at noon,
  to the external oscillator 3 return at the right. In this mode LEDs 0, 2,
  and 4 show the OSC 1, OSC 2, and external OSC 3 mix levels respectively.
- Switch up: oscillator 1 range, oscillator 2 interval, oscillator 2 fine tune.
- Switch down: external oscillator pitch offset, external LFO depth, pitch/filter destination blend.
- Changing switch position uses soft pickup for all three knobs: a page keeps
  its current settings until each physical knob reaches or crosses that
  setting, avoiding jumps between pages.
- Either pulse input or a USB MIDI note drives the first-pass VCA/gate.
- Holding down for four seconds flashes LED 5 as a warning; at five seconds the
  Main knob previews one of eight future sound-preset slots without changing
  the current voice.
- `CV Out 1` follows the current voice pitch for an external oscillator.
- `Audio In 2` is the external oscillator return; `Audio Out 1` is the filtered
  voice and `Audio Out 2` is the pre-filter mix.

The filter is currently a stable four-stage low-pass placeholder. Its detailed
ladder saturation and envelope design remain the next hardware-led work.

The first Minimoog oscillator pass uses a rounded saw for oscillator 1 and a
rounded square for oscillator 2, followed by gentle mixer saturation. This is
intentionally separate from the inherited C1ZZL3 phase-distortion engine.

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
