# Minimoog Voice: Next Stage

This is the working queue after the first hardware voice test. It records
intent, not behaviour already promised by the current firmware.

## Waveforms And Web UI

- Replace the first-pass arithmetic oscillator shapes with a band-limited LUT
  oscillator bank. The initial set is triangle, triangle-to-saw, saw, square,
  wide pulse, and narrow pulse.
- C1ZZL3 LUT assessment: retain its interpolated 1,024-sample sine table only
  as an optional utility. Its 8 x 4,096 phase-distortion table has a raw ramp
  and raw square plus intentionally complex PD shapes; it has no suitable
  triangle, triangle-to-saw, wide-pulse, or narrow-pulse source and is not
  band-limited. Do not reuse it for the Minimoog oscillator bank.
- First pass implemented: a dedicated 512-sample, nine-band Minimoog
  wavetable set selects a harmonic band from oscillator frequency. Tune the
  band boundaries and consider adjacent-band crossfades if hardware testing
  reveals audible timbral steps.
- Tune the tables and their level matching on the Workshop Computer before
  exposing waveform selection in the Web UI; the current simple shapes remain
  audibly harsh at higher pitches.
- Turn the existing visual parameter map into a Minimoog Voice-owned WebMIDI
  control surface.
- Expose oscillator 1 and oscillator 2 waveform selection separately:
  triangle, triangle-to-saw, saw, square, wide pulse, and narrow pulse.
- Use the browser layout to decide grouping before committing those choices to
  the three physical knobs and switch modes.

## Audio Performance

- Keep the audio ISR free of general integer division. The wavetable harmonic
  band selection now uses generated phase-increment thresholds; audit remaining
  pitch and transient-envelope divisions before adding more voice features.
- Replace direct shared MIDI-state writes from core 1 with a bounded lock-free
  event ring buffer consumed on the audio core. This must define overflow and
  note-off handling rather than silently losing dense MIDI events.
- Assess moving slow panel/UI state processing off the audio core after the
  event queue exists, while leaving actual audio-rate jack sampling in the
  Workshop Computer's audio path.
- Benchmark the RP2040 hardware interpolator for wavetable interpolation after
  the division and event-queue work. It can remove interpolation arithmetic,
  but needs an isolated comparison against the current two-oscillator load.

## Physical Oscillator Pages

- Make a short press and release of the switch cycle through oscillator 1,
  oscillator 2, and external oscillator 3 setup pages.
- On each page, make the three knobs available for that source's volume,
  waveform or equivalent function, and pitch offset/range.
- For oscillator 3, which is external, replace the waveform selector with an
  external-source-specific control to be chosen during hardware testing.
- Define this gesture alongside the held-down modulation page and five-second
  preset hold, so a short press cannot accidentally enter either state.

## Oscillator Page LED Grammar

- On the Up switch page, use LEDs 0, 2, and 4 to indicate the selected
  oscillator: OSC 1, OSC 2, and external OSC 3 respectively.
- Use LED 1 for oscillator 2 and oscillator 3 pitch deviation from centre:
  dark at unison, brighter as the offset moves clockwise or anticlockwise.
- Encode the selected internal oscillator waveform with LEDs 3 and 5:
  both dark for triangle; LED 3 steady for triangle-to-saw; LED 5 steady for
  saw; LED 3 flashing for square; LED 5 flashing for wide rectangle; and LEDs
  3 and 5 flashing together for narrow rectangle.

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
- Build a C1ZZL3-style named preset workflow in the Web UI: a browser-side
  preset list, editable preset name, card-slot selector, recall, save sound
  preset, rename, duplicate/new, and overwrite/delete confirmation.
- Provide eight fixed factory presets and eight named custom card slots. A
  card save must persist the custom-slot name and complete Minimoog Voice
  state together: oscillator waveforms and tuning, mixer levels and drive,
  filter, contours, modulation, keyboard tracking, output roles, and other
  audible routing choices.
- Clearly distinguish browser-only drafts, RAM recalls, and presets persisted
  to card flash. Use the same name encoding and length limit in browser and
  firmware so recalled names are reliable.
- Retain the four-second warning flash and five-second entry threshold before
  any destructive preset action.
- Migrate the retained C1ZZL3 WebMIDI/SysEx identifiers to a Minimoog Voice
  protocol, while maintaining a documented compatibility decision for existing
  host setups.

## Factory Voice Bank

- Ship a dependable `Init Voice` as the selected first preset: a single
  medium-level saw, neutral tuning, modest cutoff, no modulation, and a
  practical amp/filter contour. It is the known baseline for calibration and
  patch building.
- Build original, clearly descriptive factory voices informed by the five
  classic Minimoog sound-design examples in the referenced Reverb article:
  `Funk Glide Bass`, `Three Saw Bass`, `West Coast Whistle`, `Glide Mod Arp`,
  and `Slow Brass Lead`.
- Complete the eight factory voices with `Sub Pulse Bass`, a weighty
  wide/narrow-rectangle bass, and `Resonant Pulse Lead`, a brighter pulse-led
  solo voice with filter emphasis. These ensure the factory bank exercises the
  full intended waveform set.
- Match the useful sound-design characteristics rather than claim exact artist
  reproductions: oscillator ranges and detune, glide, mixer weight, contour
  shape, filter emphasis, keyboard tracking, and LFO/modulation assignment.
- Finalise and level-match the factory bank only after the LUT oscillator,
  proper contour, keyboard tracking, and external oscillator/LFO features are
  available on hardware.
