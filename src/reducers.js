import {combineReducers} from "redux";

import {
  SET_DEVICE,
  SET_DEVICES,
  SET_DEVICE_FILES,
  SET_DEVICE_PATH,
  SET_LOCAL_PATH,
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

export function deviceFiles(state = [], action) {
  switch (action.type) {
    case SET_DEVICE_FILES:
      return action.deviceFiles;
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
  deviceFiles,
  devicePath,
  devices,
  localPath
});
