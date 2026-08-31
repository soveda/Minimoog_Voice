# Minimoog Voice: Next Stage

This is the working queue after the first hardware voice test. It records
intent, not behaviour already promised by the current firmware.

## Waveforms And Web UI

- Replace the first-pass arithmetic oscillator shapes with a band-limited LUT
  oscillator bank. The initial set is triangle, triangle-to-saw, saw, square,
  wide pulse, and narrow pulse.
- Tune the tables and their level matching on the Workshop Computer before
  exposing waveform selection in the Web UI; the current simple shapes remain
  audibly harsh at higher pitches.
- Turn the existing visual parameter map into a Minimoog Voice-owned WebMIDI
  control surface.
- Expose oscillator 1 and oscillator 2 waveform selection separately:
  triangle, triangle-to-saw, saw, square, wide pulse, and narrow pulse.
- Use the browser layout to decide grouping before committing those choices to
  the three physical knobs and switch modes.

## Physical Oscillator Pages

- Make a short press and release of the switch cycle through oscillator 1,
  oscillator 2, and external oscillator 3 setup pages.
- On each page, make the three knobs available for that source's volume,
  waveform or equivalent function, and pitch offset/range.
- For oscillator 3, which is external, replace the waveform selector with an
  external-source-specific control to be chosen during hardware testing.
- Define this gesture alongside the held-down modulation page and five-second
  preset hold, so a short press cannot accidentally enter either state.

## Mixer And External Oscillator

- Keep the physical X scan: oscillator 1 at left, all three sources at noon,
  and the external oscillator 3 return at right.
- Add individual Web UI levels for oscillator 1, oscillator 2, the external
  oscillator return, and noise so all three sources can remain audible in any
  desired proportion beyond the physical X scan.
- Refine the mixer drive and headroom by ear with the Workshop Computer.
- Make `Pulse Out 1` an explicit selectable output role; the card cannot know
  whether it is patched to a Workshop System voice or to an external module.
- External-module sync role: patch `Pulse Out 1` to an oscillator reset or
  hard-sync input, with oscillator 1 as master. Free running emits no reset
  pulses; envelope reset emits one on each gate onset; hard sync emits a short
  pulse on each oscillator 1 phase wrap.
- Workshop System role: provide a musically useful alternate pulse output,
  starting with a short note/gate-on trigger suitable for driving another WSS
  voice or event input. Evaluate additional options such as gate mirror and
  end-of-contour trigger during hardware testing.
- Confirm the external module's sync polarity, acceptable trigger width, and
  highest reliable hard-sync frequency on Workshop Computer hardware.

## Contours And MIDI

- Replace the first-pass gate-following filter lift with separate, adjustable
  amplifier and filter ADSR contours.
- Add an adjustable filter keyboard-tracking amount, derived from the shared
  pitch-unit calculation. It must track calibrated `Audio In 1` pitch CV when
  CV controls pitch, and the active MIDI note when MIDI has pitch priority.
- Keep `CV In 1` as independent positive filter modulation rather than using
  it as the keyboard-tracking source.
- Define pulse/CV and MIDI note priority, retrigger behaviour, velocity,
  pitch bend, and the relationship between MIDI pitch and the physical range
  controls.
- Make the contour control and MIDI control changes smooth enough for musical
  use rather than merely functional tests.

## Presets And Identity

- Replace the long-hold placeholder LEDs with actual preset selection only
  after a preset stores and restores every audible voice parameter.
- Retain the four-second warning flash and five-second entry threshold before
  any destructive preset action.
- Migrate the retained C1ZZL3 WebMIDI/SysEx identifiers to a Minimoog Voice
  protocol, while maintaining a documented compatibility decision for existing
  host setups.
