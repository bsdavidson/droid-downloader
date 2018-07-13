import React from "react";
import {shallow} from "enzyme";
import renderer from "react-test-renderer";

import {DeviceList} from "../src/device_list";
import {device, devices} from "../__fixtures__/store";

test("<DeviceList />", () => {
  const wrapper = renderer
    .create(
      <DeviceList device={device} devices={devices} onDeviceChange={() => {}} />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DeviceList /> renders an empty element without any devices", () => {
  const wrapper = renderer
    .create(<DeviceList device={""} devices={[]} onDeviceChange={() => {}} />)
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DeviceList /> should call onDeviceChange when clicked", () => {
  const onDeviceChange = jest.fn();

  const wrapper = shallow(
    <DeviceList
      device={device}
      devices={devices}
      onDeviceChange={onDeviceChange}
    />
  );

  expect(onDeviceChange.mock.calls.length).toBe(0);
  wrapper
    .find(".device-list-item-inactive .device-list-item-link")
    .first()
    .simulate("click");
  expect(onDeviceChange.mock.calls.length).toBe(1);
  expect(onDeviceChange.mock.calls[0]).toEqual([devices[0].serial]);
});
