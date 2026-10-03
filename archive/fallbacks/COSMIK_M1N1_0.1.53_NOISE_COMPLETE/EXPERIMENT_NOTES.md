# Web Presets Experiment

This repository is a separate experiment cloned from the hardware-confirmed
`v0.1.10` Minimoog Voice firmware. The current workshop fallback is now the
hardware-confirmed `Cosmik M1N1 0.1.32` snapshot in
[`fallbacks/COSMIK_M1N1_0.1.32_MASTER_TUNE`](fallbacks/COSMIK_M1N1_0.1.32_MASTER_TUNE).
It preserves the matching source, Web UI, and flashable UF2 before further
experiments continue.

## This first pass

- The Web UI now has a complete voice state model for every visible control.
- `Init Voice` is the neutral calibration preset: every continuous control is
  at its displayed midpoint, bipolar controls are at zero, and three-way
  choices use their centre option.
- Both contours are ADS: attack, decay, and sustain. There is no release stage.
- The selected filter-control baseline is `0.1.42`: Middle Main controls
  cutoff, X controls resonance, and Y controls contour. Resonance only reaches
  self-oscillation at the extreme clockwise end of X.
- Eight factory voices are read-only starting points. Their broad musical roles
  are original patches informed by the Minimoog examples in the Reverb source,
  not attempts to duplicate individual recordings.
- Eight user slots store complete, named voices in browser local storage.
  `Save user slot` persists the current full state, while `Revert` returns to
  the selected factory or user voice.

## Deliberately deferred

The user slots do not yet save to the Workshop Computer flash. The inherited
C1ZZL3 persistence system stores six independent eight-stage modulation lanes,
so it is not a suitable format for this voice. The next firmware experiment
should define a compact Minimoog voice record and a new, versioned SysEx
protocol for query, audition, save, recall, delete, and named-slot listing.
The existing C1ZZL3-compatible MIDI handling remains untouched until that
protocol can be flashed and tested as a complete path.

## Factory voice bank

1. Init Voice
2. Funk Glide Bass
3. Three Saw Bass
4. West Coast Whistle
5. Glide Mod Arp
6. Slow Brass Lead
7. Sub Pulse Bass
8. Resonant Pulse Lead

Source inspiration: <https://reverb.com/uk/news/video-the-synth-sounds-of-5-classic-minimoog-tracks>.
