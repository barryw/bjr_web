import React from 'react';

export default class EditJobCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      clickHandler: props.clickHandler
    };
  }

  handleClick = () => {
    const { row, clickHandler } = this.state;
    clickHandler(row);
  }

  render() {
    return (
      <a onClick={this.handleClick}><i className="icon-note"></i></a>
    )
  }
}
