import React from "react";
import renderer from "react-test-renderer";

import {DirectoryList} from "../src/directory_list";
import {device, deviceFiles, devicePath} from "../__fixtures__/store";

jest.mock("../src/directory_list_item", () => "directory-list-item");

test("<DirectoryList />", () => {
  const wrapper = renderer
    .create(
      <DirectoryList
        device={device}
        deviceFiles={deviceFiles}
        devicePath={devicePath}
        onDeviceDirectoryClick={() => {}}
        onDeviceFileClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DirectoryList /> should render nothing without device", () => {
  const wrapper = renderer
    .create(
      <DirectoryList
        device={""}
        deviceFiles={deviceFiles}
        devicePath={devicePath}
        onDeviceDirectoryClick={() => {}}
        onDeviceFileClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DirectoryList /> should not include .. when at /", () => {
  const wrapper = renderer
    .create(
      <DirectoryList
        device={device}
        deviceFiles={deviceFiles}
        devicePath={[]}
        onDeviceDirectoryClick={() => {}}
        onDeviceFileClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DirectoryList /> should include 0 path when at /storage/emulated", () => {
  const wrapper = renderer
    .create(
      <DirectoryList
        device={device}
        deviceFiles={deviceFiles}
        devicePath={["storage", "emulated"]}
        onDeviceDirectoryClick={() => {}}
        onDeviceFileClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});
