import React from "react";
import {connect} from "react-redux";

import {traverseDevicePath, downloadFile} from "./actions";
import DirectoryListItem from "./directory_list_item";

class DirectoryList extends React.Component {
  constructor(props) {
    super(props);
  }

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
              name=".."
              type="directory"
              onClick={onDeviceDirectoryClick}
            />
          ) : null}
          {deviceFiles.map(d => (
            <DirectoryListItem
              key={d.name}
              name={d.name}
              type={d.type}
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

function mapStateToProps(state) {
  return {
    device: state.device,
    deviceFiles: state.deviceFiles,
    devicePath: state.devicePath,
    localPath: state.localPath
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
