# Minimoog Voice: Next Stage

This is the working queue after the first hardware voice test. It records
intent, not behaviour already promised by the current firmware.

## Waveforms And Web UI

- Replace the first-pass arithmetic oscillator shapes with a band-limited LUT
  oscillator bank. The initial set is triangle, triangle/sawtooth (sharktooth), saw, square,
  wide pulse, and narrow pulse.
- C1ZZL3 LUT assessment: retain its interpolated 1,024-sample sine table only
  as an optional utility. Its 8 x 4,096 phase-distortion table has a raw ramp
  and raw square plus intentionally complex PD shapes; it has no suitable
  triangle, sharktooth, wide-pulse, or narrow-pulse source and is not
  band-limited. Do not reuse it for the Minimoog oscillator bank.
- First pass implemented: a dedicated 512-sample, nine-band Minimoog
  wavetable set selects a harmonic band from oscillator frequency. Tune the
  band boundaries and consider adjacent-band crossfades if hardware testing
  reveals audible timbral steps.
- Tune the tables and their level matching on the Workshop Computer. The
  sharktooth must remain a distinct waveform profile, not a triangle/saw mix.
- Turn the existing visual parameter map into a Minimoog Voice-owned WebMIDI
  control surface.
- Expose oscillator 1 and oscillator 2 waveform selection separately:
  triangle, triangle/sawtooth (sharktooth), saw, square, wide pulse, and
  narrow pulse.
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

- Implemented: a Down press and release within half a second cycles oscillator
  1, oscillator 2, and external oscillator 3 setup pages. A longer Down hold
  retains the modulation page and five-second preset gesture.
- Main supplies OSC 1 master tune and OSC 2/3 Frequency, each with the Model
  D-style seven-semitone span. Web UI Range selectors supply the `32'`--`2'`
  pipe lengths for all three oscillators; external OSC 3's range is applied to
  the pitch emitted by `CV Out 1`.

## Oscillator Page LED Grammar

- On the Up switch page, use LEDs 0, 2, and 4 to indicate the selected
  oscillator: OSC 1, OSC 2, and external OSC 3 respectively.
- Use LED 1 for oscillator 2 and oscillator 3 pitch deviation from centre:
  dark at unison, brighter as the offset moves clockwise or anticlockwise.
- Encode the selected internal oscillator waveform with LEDs 3 and 5:
  both dark for triangle; LED 3 steady for triangle/sawtooth (sharktooth); LED 5 steady for
  saw; LED 3 flashing for square; LED 5 flashing for wide rectangle; and LEDs
  3 and 5 flashing together for narrow rectangle.

## Mixer And External Oscillator

- Implemented in the filter-control pass: Middle X replaces the physical
  oscillator-balance scan with filter resonance/emphasis. Middle now gives
  direct access to cutoff, resonance, and filter-contour amount.
- Implemented in the mixer cleanup: individual OSC 1, OSC 2, and OSC3-return
  levels are the complete mixer. The old hidden source-balance scan is retired.
- Implemented in the noise pass: white/pink noise is an ADS-gated mixer source
  with a held-Down panel. Main sets level, X selects colour, and Y crossfades
  modulation from `CV In 2` to noise. LEDs 0-3/5 show level, source blend, and
  colour; LED 4 retains the four-second preset warning.
- Assess mixer headroom by ear with the Workshop Computer, especially with all
  three oscillator sources plus noise audible.
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

## Ladder Filter

- First pass implemented: replace the original four-stage low-pass with a
  resonant, fixed four-pole ladder filter using a division-free feedback solve
  and soft transistor-style stage shaping. Validate its voicing and stability
  on Workshop Computer hardware before widening its control surface.
- Use Fr330hFr33's division-free feedback-solve and trapezoidal-integrator
  architecture as the performance reference. Its coefficient preparation and
  reciprocal lookup belong outside the audio ISR.
- Do not copy Fr330hFr33's diode-pair saturation or its three-pole mode: those
  are deliberate TB-303 voicing choices. Develop a transistor-ladder-style
  input/stage saturation curve for the warmer Minimoog character instead.
- Expose a musically scaled resonance control, test stable self-oscillation,
  and retain useful output headroom across high cutoff, resonance, and mixer
  drive settings.
- As part of this pass, assign resonance/emphasis to Middle-page X and retain
  Main for cutoff and Y for filter-contour amount.
- Add a Model D-style low/high filter-range selection, defining and testing
  the useful cutoff span for each range on Workshop System hardware.
- Add an explicit filter-modulation switch so the selected modulation source
  can be routed to cutoff independently of oscillator modulation.
- Add an explicit oscillator-modulation switch so the selected modulation
  source can be routed to oscillator pitch independently of filter modulation.
- Integrate the separate filter ADSR and keyboard tracking only after the
  resonant core is stable and voiced on Workshop Computer hardware.

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

- Factory-preset recall now stores every currently audible voice control in
  firmware. Add the remaining ADS and later routing controls to this compact
  record as they become audible, then introduce separate user flash slots.
- Build a C1ZZL3-style named preset workflow in the Web UI: a browser-side
  preset list, editable preset name, card-slot selector, recall, save sound
  preset, rename, duplicate/new, and overwrite/delete confirmation.
- Provide eight fixed factory presets and eight named custom card slots. A
  card save must persist the custom-slot name and complete Minimoog Voice
  state together: oscillator waveforms and intervals, mixer levels,
  filter, contours, modulation, keyboard tracking, output roles, and other
  audible routing choices.
- Make the preset selector a two-bank C1ZZL3-style display: LEDs 0--2 encode
  index `0--7`; LED 5 off means factory and LED 5 on means user. The Main knob
  must select all sixteen positions, while an empty user slot is visibly
  unavailable and can never overwrite a factory voice.
- Remove free OSC 2 fine tune from the Web UI and compact voice record. Keep
  it fixed at zero for deterministic digital-oscillator tuning; revisit only
  as a deliberate discrete unison/detune mode if it proves musically useful.
- Clearly distinguish browser-only drafts, RAM recalls, and presets persisted
  to card flash. Use the same name encoding and length limit in browser and
  firmware so recalled names are reliable.
- Retain the four-second warning flash and five-second entry threshold before
  any destructive preset action.
- Migrate the retained C1ZZL3 WebMIDI/SysEx identifiers to a Minimoog Voice
  protocol, while maintaining a documented compatibility decision for existing
  host setups.

## Factory Voice Bank

- Ship a dependable `Init Voice` as the selected first preset: every
  continuous control at its displayed midpoint and all bipolar controls at
  zero. It is the known neutral baseline for calibration and patch building.
- Build original, clearly descriptive factory voices informed by the five
  classic Minimoog sound-design examples in the referenced Reverb article:
  `Funk Glide Bass`, `Three Saw Bass`, `West Coast Whistle`, `Glide Mod Arp`,
  and `Slow Brass Lead`.
- Complete the eight factory voices with `Sub Pulse Bass`, a weighty
  wide/narrow-rectangle bass, and `Resonant Pulse Lead`, a brighter pulse-led
  solo voice with filter emphasis. These ensure the factory bank exercises the
  full intended waveform set.
- Match the useful sound-design characteristics rather than claim exact artist
  reproductions: oscillator ranges and intervals, glide, mixer weight, contour
  shape, filter emphasis, keyboard tracking, and LFO/modulation assignment.
- Finalise and level-match the factory bank only after the LUT oscillator,
  proper contour, keyboard tracking, and external oscillator/LFO features are
  available on hardware.
