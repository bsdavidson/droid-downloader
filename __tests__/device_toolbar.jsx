import React from "react";
import {shallow} from "enzyme";
import renderer from "react-test-renderer";

import {DeviceToolbar} from "../src/device_toolbar";
import {device, devicePath, devices} from "../__fixtures__/store";

test("<DeviceToolbar />", () => {
  const wrapper = renderer
    .create(
      <DeviceToolbar
        device={device}
        devicePath={devicePath}
        devices={devices}
        onDownloadFolderClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DeviceToolbar /> should render nothing without a device", () => {
  const wrapper = renderer
    .create(
      <DeviceToolbar
        device={""}
        devicePath={devicePath}
        devices={devices}
        onDownloadFolderClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DeviceToolbar /> should call onDownloadFolderClick", () => {
  const onDownloadFolderClick = jest.fn();

  const wrapper = shallow(
    <DeviceToolbar
      device={device}
      devicePath={devicePath}
      devices={devices}
      onDownloadFolderClick={onDownloadFolderClick}
    />
  );
  expect(onDownloadFolderClick.mock.calls.length).toBe(0);
  wrapper.find(".directory-list-toolbar-download-button").simulate("click");
  expect(onDownloadFolderClick.mock.calls.length).toBe(1);
});
