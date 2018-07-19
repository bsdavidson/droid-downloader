import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import {toggleFilePreviewFullscreen} from "./actions";

export class PreviewFullscreen extends Component {
  render() {
    if (!this.props.filePreviewImage || !this.props.filePreviewFullScreen) {
      return null;
    }
    return (
      <div className="preview-fullscreen">
        <a
          className="preview-fullscreen-link"
          href="#openfullscreen"
          onClick={this.props.onPreviewFullScreenClick}>
          <img
            alt="Fullscreen"
            className="preview-fullscreen-image"
            src={this.props.filePreviewImage}
          />
        </a>
      </div>
    );
  }
}

PreviewFullscreen.defaultProps = {
  filePreviewImage: null
};

PreviewFullscreen.propTypes = {
  filePreviewImage: PropTypes.string,
  filePreviewFullScreen: PropTypes.bool.isRequired,
  onPreviewFullScreenClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    filePreviewImage: state.filePreviewImage,
    filePreviewFullScreen: state.filePreviewFullScreen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPreviewFullScreenClick: () => {
      dispatch(toggleFilePreviewFullscreen());
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewFullscreen);
