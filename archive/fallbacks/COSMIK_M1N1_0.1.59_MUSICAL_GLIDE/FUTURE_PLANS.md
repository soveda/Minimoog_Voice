# Minimoog Voice: Current Roadmap

This is the active queue for Cosmik M1N1. It deliberately excludes completed
work so it can be used as the next-pass checklist.

## Current Baseline

- Two internal band-limited oscillators provide triangle, sharktooth, saw,
  square, wide rectangle, and narrow rectangle waveforms.
- External OSC 3 uses `CV Out 1` for calibrated pitch, `Audio In 2` for its
  mixer return, and `CV In 2` as its modulation output.
- The voice has individual OSC 1, OSC 2, external OSC 3, and white/pink noise
  mixer levels; two independent ADS contours; ladder low/high-pass modes;
  keyboard tracking; and filter/oscillator modulation enables.
- MOD SRC A selects external OSC 3/CV In 2 or Filter Contour. MOD SRC B
  selects Noise, external MOD SOURCE/CV In 2, or the internal LFO. MOD MIX,
  MOD DEPTH, source choices, LFO shape/rate, and routing are preset-backed.
- The internal LFO is free-running, triangle or square, and covers
  0.05--14 Hz. MIDI CC1 adds temporary modulation-wheel depth; CC27 retains
  the inherited phase-distortion assignment.
- The card has eight factory voices, eight named user slots, C1ZZL3-style
  two-bank preset selection, WebMIDI live sync, and user-voice migration.

## Accepted Filter And Mixer Voice

- The current low-pass and high-pass modes, gain structure, cutoff progression,
  and resonance behaviour are accepted as musically convincing on Workshop
  System hardware.
- Do not add mixer-drive or overload saturation. Preserving the current gain
  structure avoids digital artifacts and keeps passed presets unchanged.

## Oscillator Refinement

- Tune waveform level matching and wavetable band boundaries by ear on the
  Workshop Computer. Preserve sharktooth as a distinct waveform rather than a
  triangle/saw blend.
- Consider adjacent-band crossfades only if hardware testing identifies
  audible timbral steps.
- Continue avoiding general division in the audio ISR; benchmark the RP2040
  hardware interpolator only if profiling identifies wavetable interpolation
  as a meaningful cost.

## Performance And MIDI

- Preset-backed glide now has a musically accepted slew range and is applied
  consistently to MIDI, 1 V/oct pitch CV, and external OSC 3 pitch CV.
- Define and test MIDI/pulse/CV priority, retrigger behaviour, velocity,
  pitch bend, and the relationship to physical range controls.
- Move shared MIDI/UI events to a bounded lock-free queue only if dense MIDI
  traffic produces audible blocking or lost note-off events.

## Review Later

- Revisit factory-voice gain matching after oscillator-level refinement.
- Keep external OSC 3 pitch-following a patching choice: unplug `CV Out 1`
  and tune the external oscillator independently rather than adding an OSC3
  Control switch.
- Keep `Pulse Out 1` as the passed pulse-input mirror unless a specific
  Workshop System patch demonstrates a stronger alternative role.
