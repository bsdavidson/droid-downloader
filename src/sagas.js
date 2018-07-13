import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
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
  setFilePreviewPath
} from "./actions";

const {app} = require("electron").remote;

export function* downloadFile(action) {
  const {device, devicePath} = yield select();
  const file = `/${devicePath.join("/")}/${action.name}`;

  try {
    yield call(pull, device, file, app.getPath("downloads"));
    yield call(
      notify,
      "Download complete.",
      `Downloaded ${action.name} to ${app.getPath("downloads")}`
    );
  } catch (err) {
    console.error("pull error:", err);
  }
}

export function* downloadFolder() {
  const {device, devicePath} = yield select();
  const source = `/${devicePath.join("/")}`;

  try {
    yield call(pull, device, source, app.getPath("downloads"));
    yield call(
      notify,
      "Folder Download complete.",
      `Downloaded ${path.basename(source)} to ${app.getPath("downloads")}`
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
    yield put(setFilePreviewPath(null));
    return;
  }
  const file = `/${devicePath.join("/")}/${deviceFile.name}`;
  const tempPath = app.getPath("temp");

  try {
    yield call(pull, device, file, tempPath);
    yield put(setFilePreviewPath(`${tempPath}/${deviceFile.name}`));
  } catch (err) {
    console.error("preview error:", err);
  }
}

export function* refreshDeviceFiles() {
  const {device, devicePath} = yield select();

  try {
    const deviceFiles = yield call(
      getDirectoryList,
      device,
      `/${devicePath.join("/")}`
    );
    yield put(setDeviceFiles(deviceFiles));
  } catch (err) {
    console.error("getDirectoryList error:", err);
  }
}

export function* refreshDevices() {
  try {
    const devices = yield call(getDevices);
    yield put(setDevices(devices));
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
