import React from "react";
import {shallow} from "enzyme";
import renderer from "react-test-renderer";

import {FileInfo} from "../src/file_info";
import {deviceFile, devicePath} from "../__fixtures__/store";

test("<FileInfo /> should render an infoBox", () => {
  const wrapper = renderer
    .create(
      <FileInfo
        devicePath={devicePath}
        deviceFile={deviceFile}
        onDownloadClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<FileInfo /> should not render when no file is selected", () => {
  const wrapper = renderer
    .create(
      <FileInfo
        devicePath={devicePath}
        deviceFile={null}
        onDownloadClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<FileInfo /> should call onDownloadClick when download button is clicked", () => {
  const onDownloadClick = jest.fn();

  const wrapper = shallow(
    <FileInfo
      devicePath={devicePath}
      deviceFile={deviceFile}
      onDownloadClick={onDownloadClick}
    />
  );

  expect(onDownloadClick.mock.calls.length).toBe(0);
  wrapper.find(".file-info-download-link").simulate("click");
  expect(onDownloadClick.mock.calls.length).toBe(1);
  expect(onDownloadClick.mock.calls[0]).toEqual([deviceFile.name]);
});
