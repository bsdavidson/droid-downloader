import React from "react";
import {shallow} from "enzyme";
import renderer from "react-test-renderer";

import {PreviewFullscreen} from "../src/preview_fullscreen";
import {testImage} from "../__fixtures__/store";

test("<PreviewFullscreen /> should render", () => {
  const wrapper = renderer
    .create(
      <PreviewFullscreen
        filePreviewFullScreen
        filePreviewImage={testImage}
        onPreviewFullScreenClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<PreviewFullscreen /> should not render", () => {
  const wrapper = renderer
    .create(
      <PreviewFullscreen
        filePreviewFullScreen={false}
        filePreviewImage={testImage}
        onPreviewFullScreenClick={() => {}}
      />
    )
    .toJSON();
  expect(wrapper).toMatchSnapshot();
});

test("<PreviewFullscreen /> should call onPreviewFullScreenClick when clicked", () => {
  const onPreviewFullScreenClick = jest.fn();

  const wrapper = shallow(
    <PreviewFullscreen
      filePreviewFullScreen
      filePreviewImage={testImage}
      onPreviewFullScreenClick={onPreviewFullScreenClick}
    />
  );

  expect(onPreviewFullScreenClick.mock.calls.length).toBe(0);
  wrapper.find(".preview-fullscreen-link").simulate("click");
  expect(onPreviewFullScreenClick.mock.calls.length).toBe(1);
});
