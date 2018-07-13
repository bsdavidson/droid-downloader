import PropTypes from "prop-types";

const device = PropTypes.string;
const devices = PropTypes.arrayOf(
  PropTypes.shape({
    serial: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    properties: PropTypes.objectOf(PropTypes.string).isRequired
  })
);
const deviceFile = PropTypes.shape({
  type: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  permission: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});
const deviceFiles = PropTypes.arrayOf(deviceFile);
const devicePath = PropTypes.arrayOf(PropTypes.string);

export default {device, devices, devicePath, deviceFile, deviceFiles};
