import React from "react";

export default class DirectoryListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick() {
    if (this.props && this.props.onClick) {
      this.props.onClick(this.props.name);
    }
  }

  render() {
    const {name, type} = this.props;
    return (
      <li className={`directory-list-item directory-list-item-${type}`}>
        <a
          className="directory-list-item-link"
          href="#directory"
          onClick={this.handleItemClick}>
          <i
            className={`directory-list-item-icon far ${
              type === "directory" ? "fa-folder" : "fa-file"
            }`}
          />
          <span className="directory-list-item-name">{name}</span>
        </a>
      </li>
    );
  }
}
