const root = document.documentElement;
const savedTheme = localStorage.getItem("minimoog-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const midi = { access: null, input: null, output: null, log: [] };
const midiElements = {
  connect: document.querySelector("#midiConnect"),
  refresh: document.querySelector("#midiRefresh"),
  input: document.querySelector("#midiInput"),
  output: document.querySelector("#midiOutput"),
  status: document.querySelector("#midiStatus"),
  log: document.querySelector("#midiLog"),
  clearLog: document.querySelector("#midiClearLog"),
  showAll: document.querySelector("#midiShowAll"),
  sysex: document.querySelector("#midiSysex"),
  sendSysex: document.querySelector("#midiSendSysex")
};

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("minimoog-theme", theme);
  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.theme === theme);
  });
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});

document.querySelectorAll('input[type="range"]').forEach((input) => {
  const readout = document.createElement("output");
  readout.className = "range-readout";
  input.insertAdjacentElement("afterend", readout);

  const updateReadout = () => {
    readout.value = `${input.value}${input.dataset.unit ? ` ${input.dataset.unit}` : ""}`;
  };

  input.addEventListener("input", updateReadout);
  updateReadout();
});

function midiPortName(port) {
  return port.name || port.manufacturer || port.id;
}

function setMidiStatus(message) {
  midiElements.status.value = message;
}

function renderMidiLog() {
  midiElements.log.textContent = midi.log.length ? midi.log.join("\n") : "Waiting for MIDI traffic.";
  midiElements.log.scrollTop = midiElements.log.scrollHeight;
}

function logMidi(direction, data) {
  const isSysEx = data[0] === 0xf0;
  if (!isSysEx && !midiElements.showAll.checked) return;
  const bytes = Array.from(data, (byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  const type = isSysEx ? "SysEx" : "MIDI";
  midi.log.push(`${new Date().toLocaleTimeString()} ${direction} ${type}: ${bytes}`);
  if (midi.log.length > 200) midi.log.shift();
  renderMidiLog();
}

function populatePortSelect(select, ports, selectedPort) {
  const previous = selectedPort?.id || select.value;
  select.replaceChildren();
  if (!ports.length) {
    select.add(new Option("No ports available", ""));
    return null;
  }
  ports.forEach((port) => select.add(new Option(midiPortName(port), port.id)));
  const preferred = ports.find((port) => /minimoog voice/i.test(midiPortName(port)));
  select.value = ports.some((port) => port.id === previous) ? previous : (preferred || ports[0]).id;
  return ports.find((port) => port.id === select.value) || null;
}

function detachMidiInput() {
  if (midi.input) midi.input.onmidimessage = null;
}

function selectMidiPorts() {
  if (!midi.access) return;
  const inputs = [...midi.access.inputs.values()];
  const outputs = [...midi.access.outputs.values()];
  const nextInput = populatePortSelect(midiElements.input, inputs, midi.input);
  const nextOutput = populatePortSelect(midiElements.output, outputs, midi.output);
  if (nextInput?.id !== midi.input?.id) {
    detachMidiInput();
    midi.input = nextInput || null;
    if (midi.input) midi.input.onmidimessage = (event) => logMidi("IN", event.data);
  }
  midi.output = nextOutput || null;
  setMidiStatus(midi.input || midi.output ? `Connected: ${midiPortName(midi.output || midi.input)}` : "No MIDI ports found");
}

async function connectMidi() {
  if (!navigator.requestMIDIAccess) {
    setMidiStatus("WebMIDI is unavailable in this browser");
    return;
  }
  try {
    midi.access = await navigator.requestMIDIAccess({ sysex: true });
    midi.access.onstatechange = selectMidiPorts;
    selectMidiPorts();
    midiElements.connect.textContent = "Reconnect MIDI";
  } catch (error) {
    setMidiStatus(`MIDI connection failed: ${error.message}`);
  }
}

function parseSysEx(value) {
  const bytes = value.trim().split(/\s+/).filter(Boolean).map((token) => {
    if (!/^[0-9a-f]{1,2}$/i.test(token)) throw new Error(`Invalid byte: ${token}`);
    return Number.parseInt(token, 16);
  });
  if (bytes.length < 2 || bytes[0] !== 0xf0 || bytes.at(-1) !== 0xf7) {
    throw new Error("SysEx must start with F0 and end with F7");
  }
  return bytes;
}

midiElements.connect.addEventListener("click", connectMidi);
midiElements.refresh.addEventListener("click", selectMidiPorts);
midiElements.input.addEventListener("change", () => {
  if (!midi.access) return;
  detachMidiInput();
  midi.input = midi.access.inputs.get(midiElements.input.value) || null;
  if (midi.input) midi.input.onmidimessage = (event) => logMidi("IN", event.data);
  setMidiStatus(midi.input || midi.output ? `Connected: ${midiPortName(midi.output || midi.input)}` : "Not connected");
});
midiElements.output.addEventListener("change", () => {
  if (!midi.access) return;
  midi.output = midi.access.outputs.get(midiElements.output.value) || null;
  setMidiStatus(midi.input || midi.output ? `Connected: ${midiPortName(midi.output || midi.input)}` : "Not connected");
});
midiElements.clearLog.addEventListener("click", () => {
  midi.log = [];
  renderMidiLog();
});
midiElements.sendSysex.addEventListener("click", () => {
  try {
    if (!midi.output) throw new Error("Choose a MIDI output first");
    const bytes = parseSysEx(midiElements.sysex.value);
    midi.output.send(bytes);
    logMidi("OUT", bytes);
  } catch (error) {
    setMidiStatus(error.message);
  }
});

setTheme(savedTheme || preferredTheme);
