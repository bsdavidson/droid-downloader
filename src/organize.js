import fs from "fs-extra";
import path from "path";

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

export function organizeFiles(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    getFileList(sourcePath).then(files => {
      let remaining = files.length;
      const erroredFiles = [];
      function done(delta) {
        remaining -= delta;

        if (remaining === 0) {
          if (erroredFiles.length) {
            reject(erroredFiles);
            return;
          }
          resolve();
        }
      }

      files.forEach(file => {
        const fileName = path.basename(file);
        const matches = fileName.match(/^(\d{4})(\d{2})\d{2}_\d{6}(?:_\d+)?\./);
        if (!matches) {
          erroredFiles.push(file);
          done(1);

          return;
        }
        const targetDir = path.join(targetPath, matches[1], matches[2]);

        fs.ensureDir(targetDir)
          .then(() => {
            return fs.move(file, path.join(targetDir, fileName));
          })
          .then(
            () => {
              console.log("done moving file");
              done(1);
            },
            err => {
              console.log("error moving file", err);
              erroredFiles.push(file);
              done(1);
            }
          );

        console.log(matches[1], matches[2]);
      });
      done(0);
    });
  });
}
