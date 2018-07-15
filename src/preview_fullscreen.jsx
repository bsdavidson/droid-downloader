import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import {toggleFilePreviewFullscreen} from "./actions";

export class PreviewFullscreen extends Component {
  render() {
    if (!this.props.filePreviewPath || !this.props.filePreviewFullScreen) {
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
            src={`file://${this.props.filePreviewPath}`}
          />
        </a>
      </div>
    );
  }
}

PreviewFullscreen.defaultProps = {
  filePreviewPath: null
};

PreviewFullscreen.propTypes = {
  filePreviewPath: PropTypes.string,
  filePreviewFullScreen: PropTypes.bool.isRequired,
  onPreviewFullScreenClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    filePreviewPath: state.filePreviewPath,
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
