jest.mock("child_process");

import childProcess from "child_process";
import {EventEmitter} from "events";

import {
  ADBExitError,
  Device,
  DirLine,
  shellQuote,
  getDevices,
  getDirectoryList,
  pull
} from "../src/adb";

class MockProcess extends EventEmitter {
  constructor() {
    super();
    this.stdout = new EventEmitter();
    this.stderr = new EventEmitter();
  }
}

test("ADBExitError", () => {
  const err = new ADBExitError(1, "SIGTERM", "hulk smash");
  expect(err.code).toBe(1);
  expect(err.signal).toBe("SIGTERM");
  expect(err.stderr).toBe("hulk smash");
  expect(err.toString()).toBe(
    "Error: ADB exited with code 1 (signal: SIGTERM) - hulk smash"
  );
});

test("Device", () => {
  const line =
    "8407c65d               device usb:339869696X product:trltevzw model:SM_N910V device:trltevzw";
  const device = Device.parseLine(line);

  expect(device.serial).toBe("8407c65d");
  expect(device.state).toBe("device");
  expect(device.properties).toEqual({
    device: "trltevzw",
    model: "SM_N910V",
    product: "trltevzw",
    usb: "339869696X"
  });
});

test("DirLine should parse a directory line", () => {
  const line = "drwxrwx--x  5 root sdcard_rw 131072 2016-10-20 14:22 WINDOWS";
  const directory = DirLine.parseLine(line);

  expect(directory).toEqual({
    name: "WINDOWS",
    permission: "drwxrwx--x",
    size: "131072",
    timestamp: "2016-10-20 14:22",
    type: "directory"
  });
});

test("DirLine should parse a file line", () => {
  const line =
    "-rwxrwx--x  1 root sdcard_rw    296 2015-10-10 09:35 windows.bat";
  const file = DirLine.parseLine(line);

  expect(file).toEqual({
    name: "windows.bat",
    permission: "-rwxrwx--x",
    size: "296",
    timestamp: "2015-10-10 09:35",
    type: "file"
  });
});

test("DirLine should parse a line from a legacy device", () => {
  const line =
    "drwxrwx--x root     sdcard_rw          2018-02-06 19:03 Voice Recorder";
  const file = DirLine.parseLine(line);

  expect(file).toEqual({
    name: "Voice Recorder",
    permission: "drwxrwx--x",
    size: "",
    timestamp: "2018-02-06 19:03",
    type: "directory"
  });
});

test("shellQuote", () => {
  const value = `Brian's "favorite" test`; // eslint-disable-line quotes
  const quotedValue = shellQuote(value);

  expect(quotedValue).toBe(`'Brian'"'"'s "favorite" test'`); // eslint-disable-line quotes
});

test("getDevices", async () => {
  const process = new MockProcess();
  childProcess.spawn.mockReturnValueOnce(process);

  const promise = getDevices();
  const chunks = [
    "List of devices attached\n98891a335a56543448     device usb:339935232X product:dream2qlte",
    "sq model:SM_G955U device:dream2qltesq\n8407c65d               device usb:339869696X product:trltevzw model:SM_N910V device:trltevzw\n"
  ];
  chunks.forEach(c => {
    process.stdout.emit("data", c);
  });
  process.emit("close", 0, "");

  const devices = await promise;
  expect(devices).toEqual([
    new Device("98891a335a56543448", "device", {
      device: "dream2qltesq",
      model: "SM_G955U",
      product: "dream2qltesq",
      usb: "339935232X"
    }),
    new Device("8407c65d", "device", {
      device: "trltevzw",
      model: "SM_N910V",
      product: "trltevzw",
      usb: "339869696X"
    })
  ]);
});

test("getDevices with error", async () => {
  expect.assertions(1);
  const process = new MockProcess();
  childProcess.spawn.mockReturnValueOnce(process);

  const promise = getDevices();
  const chunks = ["Some Errror\nin something", "really bad\nyou ded\n"];
  chunks.forEach(c => {
    process.stderr.emit("data", c);
  });
  process.emit("close", 1, "SIGKILL");

  try {
    await promise;
  } catch (err) {
    expect(err).toEqual(new ADBExitError(1, "SIGKILL", chunks.join("")));
  }
});

test("getDirectoryList", async () => {
  const process = new MockProcess();
  childProcess.spawn.mockReturnValueOnce(process);

  const promise = getDirectoryList("serial", "/some/path");
  const chunks = [
    "drwxrwx--x root     sdcard_rw        2013-12-31 16:03 Alarms\n",
    "drwxrwx--x root     sdcard_rw        2014-12-31 16:01 Android\n",
    "-rwxrwx--x  1 root sdcard_rw    296 2015-10-10 09:35 windows.bat\n"
  ];
  chunks.forEach(c => {
    process.stdout.emit("data", c);
  });
  process.emit("close", 0, "");

  const devices = await promise;
  expect(devices).toEqual([
    new DirLine("directory", "2013-12-31 16:03", "Alarms", "drwxrwx--x", ""),
    new DirLine("directory", "2014-12-31 16:01", "Android", "drwxrwx--x", ""),
    new DirLine("file", "2015-10-10 09:35", "windows.bat", "-rwxrwx--x", "296")
  ]);
});

test("pull", async () => {
  const process = new MockProcess();
  childProcess.spawn.mockReturnValueOnce(process);

  const promise = pull("serial", "/source/path", "/destination/path");
  const chunks = ["Downloading text\n", "More downloading text\n"];
  chunks.forEach(c => {
    process.stdout.emit("data", c);
  });
  process.emit("close", 0, "");

  const devices = await promise;
  expect(devices).toEqual(["Downloading text", "More downloading text"]);
});

test("pull with error", async () => {
  expect.assertions(1);
  const process = new MockProcess();
  childProcess.spawn.mockReturnValueOnce(process);

  const promise = pull("serial", "/source/path", "/destination/path");
  const chunks = ["Some Errror\nin something", "really bad\nyou ded\n"];
  chunks.forEach(c => {
    process.stderr.emit("data", c);
  });
  process.emit("close", 1, "SIGKILL");

  try {
    await promise;
  } catch (err) {
    expect(err).toEqual(new ADBExitError(1, "SIGKILL", chunks.join("")));
  }
});
