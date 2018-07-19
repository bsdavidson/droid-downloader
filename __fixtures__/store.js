import {Device, DirLine} from "../src/adb";

export const device = "ffffbeefface";

export const deviceFiles = [
  new DirLine(
    "directory",
    "2018-01-02 09:45",
    "folder_1",
    "drwxr-xr-x",
    "3001"
  ),
  new DirLine("file", "2017-09-20 21:22", "file_1", "-rw-r--r--", "42100"),
  new DirLine("file", "2017-10-17 01:45", "file_2", "-rw-r--r--", "3125995")
];

export const deviceFile = deviceFiles[1];

export const devicePath = ["storage", "emulated", "0", "DCIM"];

export const devices = [
  new Device("ffff1337face", "device", {
    model: "SM_G955U"
  }),
  new Device("ffffbeefface", "device", {
    model: "SM_G999V"
  }),
  new Device("ffffbadbeef", "device", {
    model: "SM_G910V"
  })
];

export const localPath = "/tmp";

export const testImage =
  "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAARVBMVEX/////AAAAAAAAAP8A/wD39/c2yQA7Ozu8vP8ACvUA8wz/4+P/9PT09PTj4//09P/j4+P0//Tj/+Po+eP3/fTp6en4+P+6GBu+AAAAUklEQVRIie3RNw6AMBQE0U8wOaf7H5XKsjtGFqJA+/qpxkw+0mfMoCQ92SvmCMlWMutPk46Jkqll5igpGCXe1TAm6c6acSFZcmZU4jnmtavy4AblqhLOouOKVQAAAABJRU5ErkJggg==";
