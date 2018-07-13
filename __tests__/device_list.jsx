import React from "react";
import {shallow} from "enzyme";
import renderer from "react-test-renderer";

import {DeviceList} from "../src/device_list";
import {device, devices} from "../__fixtures__/store";

test("<DeviceList />", () => {
  const wrapper = renderer
    .create(
      <DeviceList
        device={device}
        devices={devices}
        onDeviceClick={() => {}}
        onRefreshDevicesClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DeviceList /> renders an empty element without any devices", () => {
  const wrapper = renderer
    .create(
      <DeviceList
        device={""}
        devices={[]}
        onDeviceClick={() => {}}
        onRefreshDevicesClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DeviceList /> should call onDeviceClick when clicked", () => {
  const onDeviceClick = jest.fn();

  const wrapper = shallow(
    <DeviceList
      device={device}
      devices={devices}
      onDeviceClick={onDeviceClick}
      onRefreshDevicesClick={() => {}}
    />
  );

  expect(onDeviceClick.mock.calls.length).toBe(0);
  wrapper
    .find(".device-list-item-inactive .device-list-item-link")
    .first()
    .simulate("click");
  expect(onDeviceClick.mock.calls.length).toBe(1);
  expect(onDeviceClick.mock.calls[0]).toEqual([devices[0].serial]);
});
