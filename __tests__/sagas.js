import {call, put, select} from "redux-saga/effects";
import fs from "fs";

import * as sagas from "../src/sagas";
import {Device, getDevices, pull, getDirectoryList} from "../src/adb";
import * as actions from "../src/actions";
import notify from "../src/notification";

test("downloadFile should pull a deviceFile", () => {
  const g = sagas.downloadFile({name: "file.test"});

  expect(g.next().value).toEqual(select());
  const device = "device";
  const devicePath = ["root", "child"];
  expect(g.next({device, devicePath}).value).toEqual(
    call(pull, device, "/root/child/file.test", "/tmp/downloads")
  );
  expect(g.next().value).toEqual(
    call(notify, "Download complete.", "Downloaded file.test to /tmp/downloads")
  );
  expect(g.next().done).toEqual(true);
});

test("downloadFolder should pull devicePath", () => {
  const g = sagas.downloadFolder();

  expect(g.next().value).toEqual(select());

  const device = "device";
  const devicePath = ["root", "child"];
  const localPath = "/tmp/downloads";
  expect(g.next({device, devicePath, localPath}).value).toEqual(
    call(pull, device, "/root/child", localPath)
  );
  expect(g.next().value).toEqual(
    call(
      notify,
      "Folder Download complete.",
      `Downloaded child to ${localPath}`
    )
  );
});

test("previewFile should pull a deviceFile if of Image type", () => {
  const g = sagas.previewFile();

  expect(g.next().value).toEqual(select());

  const device = "device";
  const deviceFile = {name: "filename.jpg"};
  const devicePath = ["root", "child"];

  expect(g.next({device, deviceFile, devicePath}).value).toEqual(
    call(pull, device, "/root/child/filename.jpg", "/tmp/temp")
  );
  expect(g.next({deviceFile, devicePath}).value).toEqual(
    call(fs.readFileSync, "/tmp/temp/filename.jpg")
  );
  expect(g.next("buffer").value).toEqual("YnVmZmVy");
  expect(g.next("YnVmZmVy").value).toEqual(
    put(actions.setfilePreviewImage("data:image/png;base64,YnVmZmVy"))
  );
  expect(g.next().done).toEqual(true);
});

test("previewFile should set preview to null if deviceFile is not an image", () => {
  const g = sagas.previewFile();

  expect(g.next().value).toEqual(select());

  const device = "device";
  const deviceFile = {name: "filename.bat"};
  const devicePath = ["root", "child"];

  expect(g.next({device, deviceFile, devicePath}).value).toEqual(
    put(actions.setfilePreviewImage(null))
  );

  expect(g.next().done).toEqual(true);
});

test("refreshDeviceFiles should call getDirectoryList for devicePath", () => {
  const g = sagas.refreshDeviceFiles();

  expect(g.next().value).toEqual(select());
  const device = "device";
  const devicePath = ["root", "child"];
  expect(g.next({device, devicePath}).value).toEqual(
    call(getDirectoryList, device, "/root/child")
  );
});

test("refreshDevices should call getDevices", () => {
  const g = sagas.refreshDevices();
  expect(g.next().value).toEqual(select());
  const device = new Device("serial2", "device", {});
  expect(g.next({device}).value).toEqual(call(getDevices));
  const mockDevices = [new Device("serial", "device", {})];
  expect(g.next(mockDevices).value).toEqual(
    put(actions.setDevices(mockDevices))
  );

  expect(g.next().value).toEqual(put(actions.setDevice(null)));
  expect(g.next()).toEqual({done: true, value: undefined});
});

test("resetDevicePath should reset devicePath to /storage", () => {
  const g = sagas.resetDevicePath();
  expect(g.next().value).toEqual(put(actions.setDevicePath(["storage"])));
});
