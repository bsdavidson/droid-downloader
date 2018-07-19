import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from "redux-saga/effects";

import fs from "fs";
import path from "path";

import notify from "./notification";
import {getDevices, getDirectoryList, pull} from "./adb";
import {
  DOWNLOAD_FILE,
  DOWNLOAD_FOLDER,
  REFRESH_DEVICES,
  REFRESH_DEVICE_FILES,
  SET_DEVICE,
  SET_DEVICE_FILE,
  SET_DEVICE_PATH,
  TRAVERSE_DEVICE_PATH,
  setDeviceFiles,
  setDevicePath,
  setDevices,
  setDevice,
  setfilePreviewImage
} from "./actions";

const {app} = require("electron").remote;

export function convertBase64(file) {
  if (!file) {
    return null;
  }
  return new Buffer(file).toString("base64");
}

export function* downloadFile(action) {
  const {device, devicePath, localPath} = yield select();
  const file = `/${devicePath.join("/")}/${action.name}`;
  let downloadPath;
  if (!localPath) {
    downloadPath = app.getPath("downloads");
  } else {
    downloadPath = localPath;
  }
  try {
    yield call(pull, device, file, downloadPath);
    yield call(
      notify,
      "Download complete.",
      `Downloaded ${action.name} to ${downloadPath}`
    );
  } catch (err) {
    console.error("pull error:", err);
  }
}

export function* downloadFolder() {
  const {device, devicePath, localPath} = yield select();
  const source = `${path.sep}${devicePath.join(path.sep)}`;
  if (!device) {
    return;
  }
  let downloadPath;
  if (!localPath) {
    downloadPath = app.getPath("downloads");
  } else {
    downloadPath = localPath;
  }
  try {
    yield call(pull, device, source, localPath);
    yield call(
      notify,
      "Folder Download complete.",
      `Downloaded ${path.basename(source)} to ${downloadPath}`
    );
  } catch (err) {
    console.error("pull error:", err);
  }
}

export function* previewFile() {
  const {device, deviceFile, devicePath} = yield select();
  if (!deviceFile) {
    return;
  }
  const fileExt = deviceFile.name
    .split(".")
    .pop()
    .toLowerCase();
  if (
    fileExt !== "jpg" &&
    fileExt !== "jpeg" &&
    fileExt !== "png" &&
    fileExt !== "gif"
  ) {
    yield put(setfilePreviewImage(null));
    return;
  }
  const file = `${path.sep}${devicePath.join(path.sep)}${path.sep}${
    deviceFile.name
  }`;
  const tempPath = app.getPath("temp");

  try {
    yield call(pull, device, file, tempPath);
    const fileBuffer = yield call(
      fs.readFileSync,
      `${tempPath}${path.sep}${deviceFile.name}`
    );
    const encodedImage = yield convertBase64(fileBuffer);
    yield put(setfilePreviewImage(`data:image/png;base64,${encodedImage}`));
  } catch (err) {
    console.error("preview error:", err);
  }
}

export function* refreshDeviceFiles() {
  const {device, devicePath} = yield select();
  if (!device) {
    yield put(setDeviceFiles([]));
  }

  try {
    const deviceFiles = yield call(
      getDirectoryList,
      device,
      `${path.sep}${devicePath.join(path.sep)}`
    );
    yield put(setDeviceFiles(deviceFiles));
  } catch (err) {
    console.error("getDirectoryList error:", err);
  }
}

export function* refreshDevices() {
  const {device} = yield select();

  try {
    const devices = yield call(getDevices);
    yield put(setDevices(devices));

    if (!devices.filter(d => d.serial === device)[0]) {
      yield put(setDevice(null));
    }
  } catch (err) {
    console.error("getDevices error:", err);
  }
}

export function* resetDevicePath() {
  yield put(setDevicePath(["storage"]));
}

export function* rootSaga() {
  yield all([
    takeEvery(DOWNLOAD_FILE, downloadFile),
    takeEvery(DOWNLOAD_FOLDER, downloadFolder),
    takeLatest([REFRESH_DEVICES], refreshDevices),
    takeLatest(SET_DEVICE_FILE, previewFile),
    takeLatest(
      [REFRESH_DEVICE_FILES, SET_DEVICE_PATH, TRAVERSE_DEVICE_PATH],
      refreshDeviceFiles
    ),
    takeLatest(SET_DEVICE, resetDevicePath)
  ]);
}
