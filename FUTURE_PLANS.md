# Minimoog Voice: Next Stage

This is the working queue after the first hardware voice test. It records
intent, not behaviour already promised by the current firmware.

## Waveforms And Web UI

- Turn the existing visual parameter map into a Minimoog Voice-owned WebMIDI
  control surface.
- Expose oscillator 1 and oscillator 2 waveform selection separately:
  triangle, rounded saw, rounded square, and narrow pulse.
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

## Contours And MIDI

- Replace the first-pass gate-following filter lift with separate, adjustable
  amplifier and filter ADSR contours.
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
