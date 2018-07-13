import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {ipcRenderer} from "electron";

import {refreshDevices, setLocalPath} from "./actions";

import DeviceToolbar from "./device_toolbar";
import DeviceList from "./device_list";
import DirectoryList from "./directory_list";
import FileInfo from "./file_info";

export class App extends React.Component {
  static handleLocalPathSetClick() {
    ipcRenderer.send("open-file-dialog");
  }

  componentDidMount() {
    this.props.refreshDevices();

    ipcRenderer.on("selected-directory", (event, selectedPath) => {
      this.props.onLocalPathChange(selectedPath);
      // organizeFiles(selectedPath, selectedPath).catch(erroredFiles => {
      //   console.log("erroredFiles", erroredFiles);
      // });
    });
  }

  render() {
    return (
      <div className="app">
        <div className="app-device-list">
          <DeviceList />
        </div>
        <div className="app-directory-list">
          <DeviceToolbar />
          <DirectoryList />
          <FileInfo />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  refreshDevices: PropTypes.func.isRequired,
  onLocalPathChange: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    refreshDevices: () => dispatch(refreshDevices()),
    onLocalPathChange: localPath => dispatch(setLocalPath(localPath))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(App);
