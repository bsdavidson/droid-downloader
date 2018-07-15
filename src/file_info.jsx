import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {downloadFile, toggleFilePreviewFullscreen} from "./actions";

export class FileInfo extends React.Component {
  constructor(props) {
    super(props);

    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }
  handleDownloadClick() {
    this.props.onDownloadClick(this.props.deviceFile.name);
  }
  render() {
    const {deviceFile, devicePath, filePreviewPath} = this.props;
    if (!deviceFile) {
      return null;
    }
    let previewImage;
    if (filePreviewPath) {
      previewImage = (
        <img
          className="file-info-preview-image"
          src={`file://${filePreviewPath}`}
          alt={deviceFile.name}
        />
      );
    } else {
      previewImage = (
        <p className="file-info-preview-none">No Preview Available</p>
      );
    }

    return (
      <div className="file-info">
        <div className="file-info-left">
          <div className="file-info-group file-info-path">
            <span className="file-info-label">Path:</span>
            <span className="file-info-value">
              {`/${devicePath.join("/")}`}
            </span>
          </div>
          <div className="file-info-group file-info-name">
            <span className="file-info-label">Filename:</span>
            <span className="file-info-value">{deviceFile.name}</span>
          </div>
          <div className="file-info-group file-info-size">
            <span className="file-info-label">File size:</span>
            <span className="file-info-value">{deviceFile.size} bytes</span>
          </div>
          <div className="file-info-group file-info-timestamp">
            <span className="file-info-label">Modified:</span>
            <span className="file-info-value">{deviceFile.timestamp}</span>
          </div>
          <div className="file-info-download">
            <button
              className="file-info-download-link"
              onClick={this.handleDownloadClick}>
              <i className="fas fa-file-download file-info-download-icon" />
              Download this file
            </button>
          </div>
        </div>
        <div className="file-info-right">
          <div className="file-info-preview">
            <a
              href="#previewFull"
              onClick={this.props.onPreviewFullScreenClick}>
              {previewImage}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

FileInfo.defaultProps = {
  deviceFile: null,
  filePreviewPath: null
};

FileInfo.propTypes = {
  deviceFile: PropTypes.objectOf(PropTypes.string),
  devicePath: PropTypes.arrayOf(PropTypes.string).isRequired,
  filePreviewPath: PropTypes.string,
  onDownloadClick: PropTypes.func.isRequired,
  onPreviewFullScreenClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    deviceFile: state.deviceFile,
    devicePath: state.devicePath,
    filePreviewPath: state.filePreviewPath
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDownloadClick: fileName => dispatch(downloadFile(fileName)),
    onPreviewFullScreenClick: () => {
      dispatch(toggleFilePreviewFullscreen());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileInfo);
