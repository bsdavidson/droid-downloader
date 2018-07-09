import React, {Component} from "react";
import {connect} from "react-redux";

import {downloadFolder} from "./actions";

const {app} = require("electron").remote;

class DeviceToolbar extends Component {
  render() {
    if (!this.props.device) {
      return null;
    }

    let device = this.props.devices.filter(d => {
      return d.serial === this.props.device;
    })[0];

    return (
      <div>
        <div className="directory-list-toolbar">
          <div className="directory-list-toolbar-device">
            <div>
              <span className="directory-list-toolbar-device-model">
                {device ? device.properties.model.replace(/_/g, " ") : null}
              </span>
              <span className="directory-list-toolbar-device-serial">
                {this.props.device}
              </span>
            </div>

            <div className="directory-list-toolbar-path">
              Folder listing for /{this.props.devicePath.join("/")}
            </div>
          </div>

          <div className="directory-list-toolbar-download">
            <button
              onClick={this.props.onDownloadFolderClick}
              className="directory-list-toolbar-download-button">
              <i className="fas fa-download directory-list-toolbar-download-icon" />
              Download this folder
            </button>
            <div className="directory-list-toolbar-path-destination">
              Files will be downloaded to {app.getPath("downloads")}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    device: state.device,
    devicePath: state.devicePath,
    devices: state.devices
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDownloadFolderClick: () => dispatch(downloadFolder())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceToolbar);