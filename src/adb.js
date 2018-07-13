import {spawn} from "child_process";

export class ADBExitError extends Error {
  constructor(code, signal, stderr) {
    super(`ADB exited with code ${code} (signal: ${signal}) - ${stderr}`);
    this.code = code;
    this.signal = signal;
    this.stderr = stderr;
  }
}

export class Device {
  constructor(serial, state, properties) {
    this.serial = serial;
    this.state = state;
    this.properties = properties;
  }

  static parseLine(line) {
    const fields = line.split(/ +/);
    return new Device(
      fields[0],
      fields[1],
      fields.slice(2).reduce((p, s) => {
        const [k, v] = s.split(":");
        p[k] = v; // eslint-disable-line no-param-reassign
        return p;
      }, {})
    );
  }
}

export class DirLine {
  constructor(type, timestamp, name, permission, size) {
    this.type = type;
    this.timestamp = timestamp;
    this.permission = permission;
    this.size = size;
    this.name = name;
  }

  static parseLine(line) {
    const parts = line
      .trim()
      .match(
        /^([^ ]+) +(\d+ +)?([^ ]+ +)([^ ]+ +)(\d+ +)?(\d{4}-\d{2}-\d{2} +\d{2}:\d{2}) +(.+)$/
      );
    if (!parts) {
      return null;
    }
    const [
      matched,
      permission,
      links,
      user,
      group,
      size,
      timestamp,
      name
    ] = parts.map(p => {
      if (!p) {
        return "";
      }
      return p.trim();
    });

    return new DirLine(
      permission.charAt(0) === "d" || permission[1].charAt(0) === "l"
        ? "directory"
        : "file",
      timestamp,
      name,
      permission,
      size
    );
  }
}

export function shellQuote(value) {
  // (╯°□°）╯︵ ┻━┻
  return "'" + value.replace("'", `'"'"'`) + "'"; // eslint-disable-line prefer-template, quotes
}

export function getDevices() {
  return new Promise((resolve, reject) => {
    const process = spawn("/usr/local/bin/adb", ["devices", "-l"]);
    let stdoutBuffer = "";
    let stderrBuffer = "";

    process.stdout.on("data", data => {
      stdoutBuffer += data.toString();
    });

    process.stderr.on("data", data => {
      stderrBuffer += data.toString();
    });

    process.on("close", (code, signal) => {
      if (code) {
        reject(new ADBExitError(code, signal, stderrBuffer));
        return;
      }
      resolve(
        stdoutBuffer
          .trim()
          .split("\n")
          .slice(1)
          .map(Device.parseLine)
      );
    });
  });
}

export function getDirectoryList(deviceSerial, dirPath) {
  return new Promise(resolve => {
    const process = spawn("/usr/local/bin/adb", [
      "-s",
      deviceSerial,
      "shell",
      "ls",
      "-l",
      shellQuote(dirPath)
    ]);
    let stdoutBuffer = "";
    let stderrBuffer = "";

    process.stdout.on("data", data => {
      stdoutBuffer += data.toString();
    });

    process.stderr.on("data", data => {
      stderrBuffer += data.toString();
    });

    process.on("close", (code, signal) => {
      if (code) {
        // It is expected that ls will exit with an error code when it
        // encounters files or directories that it doesn't have permission
        // to access.
        console.warn(new ADBExitError(code, signal, stderrBuffer));
      }
      resolve(
        stdoutBuffer
          .trim()
          .split("\n")
          .map(DirLine.parseLine)
          .filter(d => d)
      );
    });
  });
}

export function pull(deviceSerial, source, destination) {
  return new Promise((resolve, reject) => {
    const process = spawn("/usr/local/bin/adb", [
      "-s",
      deviceSerial,
      "pull",
      source,
      destination
    ]);
    let stdoutBuffer = "";
    let stderrBuffer = "";

    process.stdout.on("data", data => {
      stdoutBuffer += data.toString();
    });

    process.stderr.on("data", data => {
      stderrBuffer += data.toString();
    });

    process.on("close", (code, signal) => {
      if (code) {
        reject(new ADBExitError(code, signal, stderrBuffer));
        return;
      }
      resolve(stdoutBuffer.trim().split("\n"));
    });
  });
}
