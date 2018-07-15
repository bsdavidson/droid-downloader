import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {setDevice, refreshDevices} from "./actions";
import DroidPropTypes from "./prop_types";

export class DeviceList extends React.Component {
  render() {
    const {devices, device} = this.props;

    return (
      <div className="device-list">
        {devices.length > 0 ? (
          devices.map(d => (
            <div
              className={`device-list-item device-list-item-${
                d.serial === device ? "active" : "inactive"
              }`}
              key={d.serial}>
              <a
                href="#device"
                className="device-list-item-link"
                onClick={() => this.props.onDeviceClick(d.serial)}>
                <i className="device-list-item-icon fas fa-mobile-alt" />
                <span className="device-list-item-model">
                  {d.properties.model.replace(/_/g, " ")}
                </span>
              </a>
            </div>
          ))
        ) : (
          <span className="device-list-nodevices">No Devices Found</span>
        )}
        <div className="device-list-refresh">
          <a
            className="device-list-refresh-link"
            href="#refresh"
            onClick={this.props.onRefreshDevicesClick}>
            <i className="device-list-refresh-icon fas fa-sync-alt" />
            Refresh
          </a>
        </div>
      </div>
    );
  }
}

DeviceList.propTypes = {
  device: DroidPropTypes.device.isRequired,
  devices: DroidPropTypes.devices.isRequired,
  onDeviceClick: PropTypes.func.isRequired,
  onRefreshDevicesClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    devices: state.devices,
    device: state.device
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeviceClick: device => dispatch(setDevice(device)),
    onRefreshDevicesClick: () => dispatch(refreshDevices())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
