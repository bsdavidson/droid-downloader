import PropTypes from "prop-types";

const device = PropTypes.string;
const devices = PropTypes.arrayOf(
  PropTypes.shape({
    serial: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    properties: PropTypes.objectOf(PropTypes.string).isRequired
  })
);
const devicePath = PropTypes.arrayOf(PropTypes.string);
const deviceFiles = PropTypes.arrayOf(
  PropTypes.shape({
    type: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    permission: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    line: PropTypes.string.isRequired
  })
);

export default {device, devices, devicePath, deviceFiles};
