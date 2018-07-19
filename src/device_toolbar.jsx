import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {downloadFolder, setDevicePath} from "./actions";
import DroidPropTypes from "./prop_types";
import {App} from "./app";

// const {app} = require("electron").remote;

export class DeviceToolbar extends Component {
  static handleDownloadPathClick() {
    App.handleLocalPathSetClick();
  }

  constructor(props) {
    super(props);

    this.handleBreadCrumbClick = this.handleBreadCrumbClick.bind(this);
  }

  handleBreadCrumbClick(event) {
    this.props.onBreadCrumbPathClick(
      event.target.getAttribute("data-path").split("|#")
    );
  }

  render() {
    if (!this.props.device || this.props.devices.length === 0) {
      return null;
    }

    const device = this.props.devices.filter(
      d => d.serial === this.props.device
    )[0];

    const renderedPath = [
      <span className="directory-list-toolbar-crumb" key="rootdir">
        <span className="directory-list-toolbar-crumb-sep">/</span>
        <a
          href="#dir"
          className="directory-list-toolbar-crumb-link"
          data-path={""}
          onClick={this.handleBreadCrumbClick}>
          root
        </a>
      </span>
    ];

    const crumbPath = [];
    this.props.devicePath.forEach(dir => {
      if (!dir) {
        return;
      }
      crumbPath.push(dir);
      renderedPath.push(
        <span className="directory-list-toolbar-crumb" key={dir}>
          <span className="directory-list-toolbar-crumb-sep">/</span>
          <a
            href="#dir"
            className="directory-list-toolbar-crumb-link"
            data-path={crumbPath.join("|#")}
            onClick={this.handleBreadCrumbClick}>
            {dir}
          </a>
        </span>
      );
    });

    return (
      <div className="directory-list-toolbar">
        <div className="directory-list-toolbar-top">
          <div className="directory-list-toolbar-device">
            <span className="directory-list-toolbar-device-model">
              {device ? device.properties.model.replace(/_/g, " ") : null}
            </span>
            <span className="directory-list-toolbar-device-serial">
              {this.props.device}
            </span>
          </div>
          <div className="directory-list-toolbar-download">
            <button
              onClick={this.props.onDownloadFolderClick}
              className="directory-list-toolbar-download-button">
              <i className="fas fa-download directory-list-toolbar-download-icon" />
              Download this folder
            </button>
            <div className="directory-list-toolbar-path-destination">
              Files will be downloaded to{" "}
              <a
                className="directory-list-toolbar-path-link"
                href="#changepath"
                onClick={DeviceToolbar.handleDownloadPathClick}>
                {this.props.localPath}
              </a>
            </div>
          </div>
        </div>
        <div className="directory-list-toolbar-path">{renderedPath}</div>
      </div>
    );
  }
}

DeviceToolbar.defaultProps = {
  device: null
};

DeviceToolbar.propTypes = {
  device: DroidPropTypes.device,
  devicePath: DroidPropTypes.devicePath.isRequired,
  devices: DroidPropTypes.devices.isRequired,
  localPath: PropTypes.string,
  onDownloadFolderClick: PropTypes.func.isRequired,
  onBreadCrumbPathClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    device: state.device,
    devicePath: state.devicePath,
    devices: state.devices,
    localPath: state.localPath
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDownloadFolderClick: () => dispatch(downloadFolder()),
    onBreadCrumbPathClick: path => {
      dispatch(setDevicePath(path));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceToolbar);
