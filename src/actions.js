export const DOWNLOAD_FILE = "DOWNLOAD_FILE";
export const DOWNLOAD_FOLDER = "DOWNLOAD_FOLDER";
export const REFRESH_DEVICES = "REFRESH_DEVICES";
export const REFRESH_DEVICE_FILES = "REFRESH_DEVICE_FILES";
export const SET_DEVICE = "SET_DEVICE";
export const SET_DEVICES = "SET_DEVICES";
export const SET_DEVICE_FILE = "SET_DEVICE_FILE";
export const SET_DEVICE_FILES = "SET_DEVICE_FILES";
export const SET_DEVICE_PATH = "SET_DEVICE_PATH";
export const SET_FILE_PREVIEW_PATH = "SET_FILE_PREVIEW_PATH";
export const SET_LOCAL_PATH = "SET_LOCAL_PATH";
export const TRAVERSE_DEVICE_PATH = "TRAVERSE_DEVICE_PATH";

export function downloadFile(name) {
  return {type: DOWNLOAD_FILE, name};
}

export function downloadFolder() {
  return {type: DOWNLOAD_FOLDER};
}

export function refreshDeviceFiles() {
  return {type: REFRESH_DEVICE_FILES};
}

export function refreshDevices() {
  return {type: REFRESH_DEVICES};
}

export function setDevice(device) {
  return {type: SET_DEVICE, device};
}

export function setDeviceFile(deviceFile) {
  return {type: SET_DEVICE_FILE, deviceFile};
}

export function setDeviceFiles(deviceFiles) {
  return {type: SET_DEVICE_FILES, deviceFiles};
}

export function setDevicePath(devicePath) {
  return {type: SET_DEVICE_PATH, devicePath};
}

export function setDevices(devices) {
  return {type: SET_DEVICES, devices};
}

export function setFilePreviewPath(filePreviewPath) {
  return {type: SET_FILE_PREVIEW_PATH, filePreviewPath};
}

export function setLocalPath(localPath) {
  return {type: SET_LOCAL_PATH, localPath};
}

export function traverseDevicePath(dirName) {
  return {type: TRAVERSE_DEVICE_PATH, dirName};
}
