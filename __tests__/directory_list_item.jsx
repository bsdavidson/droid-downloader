import React from "react";
import {shallow} from "enzyme";
import renderer from "react-test-renderer";

import DirectoryListItem from "../src/directory_list_item";
import {deviceFiles} from "../__fixtures__/store";

test("<DirectoryListItem /> should render a file", () => {
  const wrapper = renderer
    .create(<DirectoryListItem onClick={() => {}} item={deviceFiles[1]} />)
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DirectoryListItem /> should render a directory", () => {
  const wrapper = renderer
    .create(<DirectoryListItem onClick={() => {}} item={deviceFiles[0]} />)
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<DirectoryListItem /> should call onClick", () => {
  const onClick = jest.fn();
  const wrapper = shallow(
    <DirectoryListItem onClick={onClick} item={deviceFiles[0]} />
  );
  expect(onClick.mock.calls.length).toBe(0);
  wrapper.find(".directory-list-item-link").simulate("click");
  expect(onClick.mock.calls.length).toBe(1);
  expect(onClick.mock.calls[0]).toEqual([deviceFiles[0]]);
});
