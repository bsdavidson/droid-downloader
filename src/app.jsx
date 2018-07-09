import React from "react";
import {connect} from "react-redux";
import {ipcRenderer} from "electron";

import {refreshDevices, setLocalPath} from "./actions";
import {organizeFiles} from "./organize";

import DeviceToolbar from "./device_toolbar";
import DeviceList from "./device_list";
import DirectoryList from "./directory_list";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleLocalPathSetClick = this.handleLocalPathSetClick.bind(this);
  }

  componentDidMount() {
    this.props.refreshDevices();

    ipcRenderer.on("selected-directory", (event, selectedPath) => {
      this.props.onLocalPathChange(selectedPath);
      organizeFiles(selectedPath, selectedPath).catch(erroredFiles => {
        console.log("erroredFiles", erroredFiles);
      });
    });
  }

  handleLocalPathSetClick() {
    ipcRenderer.send("open-file-dialog");
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
        </div>
      </div>
    );
  }
}

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
