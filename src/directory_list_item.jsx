import React from "react";
import PropTypes from "prop-types";

export default class DirectoryListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick() {
    if (this.props && this.props.onClick) {
      this.props.onClick(this.props.item.name);
    }
  }

  render() {
    const {item} = this.props;
    return (
      <li className={`directory-list-item directory-list-item-${item.type}`}>
        <a
          className="directory-list-item-link"
          href="#directory"
          onClick={this.handleItemClick}>
          <i
            className={`directory-list-item-icon far ${
              item.type === "directory" ? "fa-folder" : "fa-file"
            }`}
          />
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
