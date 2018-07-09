import React from "react";
import {connect} from "react-redux";

import {setDevice} from "./actions";

class DeviceList extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeviceChange = this.handleDeviceChange.bind(this);
  }
  handleDeviceChange(event) {
    this.props.onDeviceChange(event.target.value);
  }

  render() {
    const {devices, device} = this.props;
    return (
      <div className="device-list">
        {devices.map(d => (
          <div
            className={`device-list-item device-list-item-${
              d.serial === device ? "active" : "inactive"
            }`}
            key={d.serial}>
            <a
              href="#device"
              className="device-list-item-link"
              onClick={() => this.props.onDeviceChange(d.serial)}>
              <i className="device-list-item-icon fas fa-mobile-alt" />
              <span className="device-list-item-model">
                {d.properties.model.replace(/_/g, " ")}
              </span>
            </a>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    devices: state.devices,
    device: state.device
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeviceChange: device => dispatch(setDevice(device))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
