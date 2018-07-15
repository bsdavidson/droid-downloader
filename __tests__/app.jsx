import React from "react";
import renderer from "react-test-renderer";

import {App} from "../src/app";

jest.mock("../src/device_list", () => "device-list");
jest.mock("../src/device_toolbar", () => "device-toolbar");
jest.mock("../src/directory_list", () => "directory-list");
jest.mock("../src/file_info", () => "file-info");
jest.mock("../src/preview_fullscreen", () => "preview-fullscreen");

test("<App /> renders app", () => {
  const wrapper = renderer
    .create(<App refreshDevices={() => {}} onLocalPathChange={() => {}} />)
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});
