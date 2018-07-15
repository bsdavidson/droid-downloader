import {combineReducers} from "redux";

import {
  REFRESH_DEVICES,
  SET_DEVICE,
  SET_DEVICES,
  SET_DEVICE_FILE,
  SET_DEVICE_FILES,
  SET_DEVICE_PATH,
  SET_FILE_PREVIEW_PATH,
  SET_LOCAL_PATH,
  TOGGLE_FILE_PREVIEW,
  TRAVERSE_DEVICE_PATH
} from "./actions";

export function device(state = "", action) {
  switch (action.type) {
    case SET_DEVICE:
      return action.device;
    default:
      return state;
  }
}

export function deviceFile(state = null, action) {
  switch (action.type) {
    case SET_DEVICE_FILE:
      return action.deviceFile;
    case SET_DEVICE_PATH:
      return null;
    case SET_DEVICES:
      return null;
    case TRAVERSE_DEVICE_PATH:
      return null;
    default:
      return state;
  }
}

export function deviceFiles(state = [], action) {
  switch (action.type) {
    case SET_DEVICE_FILES:
      return action.deviceFiles;
    case SET_DEVICE:
      return [];
    default:
      return state;
  }
}

export function devicePath(state = ["storage"], action) {
  switch (action.type) {
    case SET_DEVICE_PATH:
      return action.devicePath;
    case TRAVERSE_DEVICE_PATH:
      switch (action.dirName) {
        case ".":
          return state;
        case "..":
          return state.slice(0, -1);
        default:
          return [...state, action.dirName];
      }
    default:
      return state;
  }
}

export function devices(state = [], action) {
  switch (action.type) {
    case SET_DEVICES:
      return action.devices;
    default:
      return state;
  }
}

export function filePreviewPath(state = null, action) {
  switch (action.type) {
    case SET_FILE_PREVIEW_PATH:
      return action.filePreviewPath;
    default:
      return state;
  }
}

export function filePreviewFullScreen(state = false, action) {
  switch (action.type) {
    case TOGGLE_FILE_PREVIEW:
      return state === false;
    case SET_DEVICE_PATH:
      return false;
    case SET_DEVICE_FILES:
      return false;
    case SET_DEVICE_FILE:
      return false;
    case REFRESH_DEVICES:
      return false;
    default:
      return state;
  }
}

export function localPath(state = "", action) {
  switch (action.type) {
    case SET_LOCAL_PATH:
      return action.localPath;
    default:
      return state;
  }
}

export const reducer = combineReducers({
  device,
  deviceFile,
  deviceFiles,
  devicePath,
  devices,
  filePreviewFullScreen,
  filePreviewPath,
  localPath
});
