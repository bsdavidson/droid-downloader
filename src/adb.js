import {spawn} from "child_process";
import fs from "fs-extra";
import path from "path";

class ADBExitError extends Error {
  constructor(code, signal, stderr) {
    super(`ADB exited with code ${code} (signal: ${signal}) - ${stderr}`);
    this.code = code;
    this.signal = signal;
    this.stderr = stderr;
  }
}

class Device {
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

class DirLine {
  constructor(line, type, timestamp, name) {
    this.type = type;
    this.timestamp = timestamp;
    this.name = name;
    this.line = line;
  }

  static parseLine(line) {
    const parts = line
      .trim()
      .match(
        /^([^ ]+) +(?:[^ ]+ +){2,4}(\d{4}-\d{2}-\d{2} +\d{2}:\d{2}) +(.+)$/
      );
    if (!parts) {
      return null;
    }

    return new DirLine(
      line,
      parts[1].charAt(0) === "d" || parts[1].charAt(0) === "l"
        ? "directory"
        : "file",
      parts[2],
      parts[3].trim()
    );
  }
}

function shellQuote(value) {
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

export function getFileList(rootPath) {
  return new Promise((resolve, reject) => {
    let fileList = [];
    fs.readdir(rootPath, (err, names) => {
      if (err) {
        reject(err);
        return;
      }
      let remaining = names.length;
      function done(delta) {
        remaining -= delta;
        if (remaining === 0) {
          fileList.sort();
          resolve(fileList);
        }
      }
      names.forEach(name => {
        const filePath = path.join(rootPath, name);
        fs.lstat(filePath, (statErr, stats) => {
          if (statErr) {
            console.log(`error in lstat for ${filePath}: ${statErr}`);
          } else if (stats.isDirectory()) {
            getFileList(filePath).then(items => {
              fileList = fileList.concat(items);
              done(1);
            });
            return; // prevent done() from being called too soon
          } else if (stats.isFile()) {
            fileList.push(filePath);
          }
          done(1);
        });
      });
      done(0);
    });
  });
}

export function pull(deviceSerial, source, destination) {
  console.log(deviceSerial, source, destination);
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
