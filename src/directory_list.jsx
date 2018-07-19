import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {traverseDevicePath, setDeviceFile} from "./actions";
import DirectoryListItem from "./directory_list_item";
import DroidPropTypes from "./prop_types";

export class DirectoryList extends React.Component {
  render() {
    const {
      onDeviceDirectoryClick,
      onDeviceFileClick,
      device,
      devicePath,
      deviceFile,
      deviceFiles
    } = this.props;
    if (!device) {
      return null;
    }
    const wrapperClass = deviceFile
      ? "directory-list file-info-present"
      : "directory-list";
    return (
      <div className={wrapperClass}>
        <ul className="directory-list-items">
          {devicePath.length > 0 ? (
            <DirectoryListItem
              key=".."
              item={{name: "..", type: "directory"}}
              type="directory"
              onClick={onDeviceDirectoryClick}
            />
          ) : null}

          {devicePath.length === 2 &&
          devicePath[0] === "storage" &&
          devicePath[1] === "emulated" ? (
            // Manually adding the 0 directory as it will not normally show due
            // to permission issues with ADB.
            <DirectoryListItem
              key="0"
              item={{name: "0", type: "directory"}}
              type="directory"
              onClick={onDeviceDirectoryClick}
            />
          ) : null}
          {deviceFiles.map(d => (
            <DirectoryListItem
              key={d.name}
              item={d}
              onClick={
                d.type === "directory"
                  ? onDeviceDirectoryClick
                  : onDeviceFileClick
              }
            />
          ))}
        </ul>
      </div>
    );
  }
}

DirectoryList.defaultProps = {
  deviceFile: null,
  device: null
};

DirectoryList.propTypes = {
  onDeviceDirectoryClick: PropTypes.func.isRequired,
  onDeviceFileClick: PropTypes.func.isRequired,
  device: DroidPropTypes.device,
  devicePath: DroidPropTypes.devicePath.isRequired,
  deviceFile: DroidPropTypes.deviceFile,
  deviceFiles: DroidPropTypes.deviceFiles.isRequired
};

function mapStateToProps(state) {
  return {
    device: state.device,
    deviceFile: state.deviceFile,
    deviceFiles: state.deviceFiles,
    devicePath: state.devicePath
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeviceDirectoryClick: item => dispatch(traverseDevicePath(item.name)),
    onDeviceFileClick: deviceFile => dispatch(setDeviceFile(deviceFile))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectoryList);
