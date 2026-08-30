# Minimoog Voice

An in-progress, Minimoog-influenced mono voice for the Music Thing Modular
Workshop Computer. It begins from the stable C1ZZL3 Gnarly architecture, while
moving toward a two-internal-oscillator voice with an external oscillator 3
pitch/CV loop and external-LFO modulation.

## First Firmware Pass

- Switch middle: cutoff, oscillator mixer, contour.
- Switch up: oscillator 1 range, oscillator 2 interval, oscillator 2 fine tune.
- Switch down: external oscillator pitch offset, external LFO depth, pitch/filter destination blend.
- Holding down for four seconds flashes LED 5 as a warning; at five seconds the
  Main knob selects an envelope preset.
- `CV Out 1` follows the current voice pitch for an external oscillator.
- `Audio In 2` is the external oscillator return; `Audio Out 1` is the filtered
  voice and `Audio Out 2` is the pre-filter mix.

The filter is currently a stable four-stage low-pass placeholder. Its detailed
ladder saturation, envelope design, and final mixer behaviour remain the next
hardware-led work.

## Web Control Surface

Open `web/index.html` in a browser. This first screen is deliberately a visual
parameter map, not yet a WebMIDI transport. It includes every planned voice,
mixer, filter, contour, modulation, and patch-point control so their grouping
can be decided in context.

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
