import {getDirectoryList, getDevices, getFileList, pull} from "./adb";
import path from "path";

const {app} = require("electron").remote;
export const SET_DEVICE = "SET_DEVICE";
export const SET_DEVICES = "SET_DEVICES";
export const SET_DEVICE_FILES = "SET_DEVICE_FILES";
export const SET_DEVICE_PATH = "SET_DEVICE_PATH";
export const SET_LOCAL_PATH = "SET_LOCAL_PATH";
export const TRAVERSE_DEVICE_PATH = "TRAVERSE_DEVICE_PATH";

export function refreshDeviceFiles() {
  return (dispatch, getState) => {
    const {device, devicePath} = getState();
    return getDirectoryList(device, `/${devicePath.join("/")}`)
      .then(deviceFiles => {
        dispatch({type: SET_DEVICE_FILES, deviceFiles});
      })
      .catch(err => {
        console.error("getDirectoryList error:", err);
      });
  };
}

export function downloadFile(name) {
  return (dispatch, getState) => {
    const {device, devicePath} = getState();
    const file = `/${devicePath.join("/")}/${name}`;

    pull(device, file, app.getPath("downloads")).then(msg => {
      new Notification("Download complete.", {
        silent: true,
        body: `Downloaded ${name} to ${app.getPath("downloads")}`
      });
    });
  };
}

export function downloadFolder() {
  return (dispatch, getState) => {
    const {device, devicePath} = getState();
    const source = `/${devicePath.join("/")}`;

    return pull(device, source, app.getPath("downloads"))
      .then(message => {
        new Notification("Folder Download complete.", {
          silent: true,
          body: `Downloaded ${path.basename(source)} to ${app.getPath(
            "downloads"
          )}`
        });
        return message;
      })
      .catch(err => {
        console.error("pull error:", err);
      });
  };
}

export function refreshDevices() {
  return dispatch => {
    return getDevices()
      .then(devices => {
        console.log("devices", devices);
        dispatch({type: SET_DEVICES, devices});
        return devices;
      })
      .catch(err => {
        console.error("getDevices error:", err);
      });
  };
}

export function setDevice(device) {
  return dispatch => {
    dispatch({type: SET_DEVICE, device});
    return dispatch(setDevicePath(["storage"]));
  };
}

export function setDevicePath(devicePath) {
  return dispatch => {
    dispatch({type: SET_DEVICE_PATH, devicePath});
    return dispatch(refreshDeviceFiles());
  };
}

export function setLocalPath(localPath) {
  return {type: SET_LOCAL_PATH, localPath};
}

export function traverseDevicePath(dirName) {
  return dispatch => {
    dispatch({type: TRAVERSE_DEVICE_PATH, dirName});
    return dispatch(refreshDeviceFiles());
  };
}
