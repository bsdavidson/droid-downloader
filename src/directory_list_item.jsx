import React from "react";
import PropTypes from "prop-types";
import path from "path";

const iconClasses = {
  ".dng": "file-image",
  ".gif": "file-image",
  ".jpeg": "file-image",
  ".jpg": "file-image",
  ".png": "file-image",
  ".psd": "file-image",
  ".svg": "file-image",

  ".aac": "file-audio",
  ".aiff": "file-audio",
  ".flac": "file-audio",
  ".it": "file-audio",
  ".m4a": "file-audio",
  ".mid": "file-audio",
  ".mod": "file-audio",
  ".mp3": "file-audio",
  ".ogg": "file-audio",
  ".s3m": "file-audio",
  ".wav": "file-audio",
  ".xm": "file-audio",

  ".3gp": "file-video",
  ".avi": "file-video",
  ".m4v": "file-video",
  ".mkv": "file-video",
  ".mov": "file-video",
  ".mpeg": "file-video",
  ".mpg": "file-video",

  ".pdf": "file-pdf",

  ".7z": "file-archive",
  ".bz2": "file-archive",
  ".gz": "file-archive",
  ".rar": "file-archive",
  ".tar": "file-archive",
  ".zip": "file-archive",

  ".txt": "file-alt"
};

export default class DirectoryListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick() {
    if (this.props && this.props.onClick) {
      this.props.onClick(this.props.item);
    }
  }

  render() {
    const {item} = this.props;

    let iconClass;
    if (item.type === "directory") {
      iconClass = "folder";
    } else {
      iconClass = iconClasses[path.extname(item.name).toLowerCase()] || "file";
    }

    return (
      <li className={`directory-list-item directory-list-item-${item.type}`}>
        <a
          className="directory-list-item-link"
          href="#directory"
          onClick={this.handleItemClick}>
          <i className={`directory-list-item-icon far fa-${iconClass}`} />
          <span className="directory-list-item-elem directory-list-item-name">
            {item.name}
          </span>
        </a>
      </li>
    );
  }
}

DirectoryListItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
