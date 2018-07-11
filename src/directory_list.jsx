import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {traverseDevicePath, downloadFile} from "./actions";
import DirectoryListItem from "./directory_list_item";
import DroidPropTypes from "./prop_types";

class DirectoryList extends React.Component {
  render() {
    const {
      onDeviceDirectoryClick,
      onDeviceFileClick,
      device,
      devicePath,
      deviceFiles
    } = this.props;
    if (!device) {
      return null;
    }
    return (
      <div className="directory-list">
        <ul className="directory-list-items">
          {device && devicePath.length > 0 ? (
            <DirectoryListItem
              key=".."
              item={{name: "..", type: "directory"}}
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

DirectoryList.propTypes = {
  onDeviceDirectoryClick: PropTypes.func.isRequired,
  onDeviceFileClick: PropTypes.func.isRequired,
  device: DroidPropTypes.device.isRequired,
  devicePath: DroidPropTypes.devicePath.isRequired,
  deviceFiles: DroidPropTypes.deviceFiles.isRequired
};

function mapStateToProps(state) {
  return {
    device: state.device,
    deviceFiles: state.deviceFiles,
    devicePath: state.devicePath
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeviceDirectoryClick: dirName => dispatch(traverseDevicePath(dirName)),
    onDeviceFileClick: name => dispatch(downloadFile(name))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectoryList);
