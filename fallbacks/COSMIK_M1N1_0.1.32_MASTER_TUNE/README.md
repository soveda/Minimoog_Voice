# Cosmik M1N1 0.1.32 Fallback

This is the hardware-confirmed fallback for the Web Presets experiment.

- Firmware: `COSMIK_M1N1_0.1.32_EXPERIMENTAL_MASTER_TUNE.uf2`
- SHA-256: `0342bb125003c18883c5df95fb5b1cd4f852b113c07f545bb5e3acc42e812583`
- Source: the matching firmware, LUT, USB MIDI, build, and Web UI files are
  preserved in this directory.

It includes the confirmed preset workflow, triangle level compensation,
calibrated Audio In 1 V/oct tracking, and the Model D-style OSC 1 hardware
master tune range of seven semitones below to seven semitones above C3.

To restore a card for workshop testing, flash the UF2 in this directory. Do
not replace this snapshot when making later experimental builds.
