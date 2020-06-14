import React from 'react';

import HelpIcon from '../HelpIcon';

export default class EditCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      tooltip: props.tooltip,
      clickHandler: props.clickHandler,
      icon: props.icon
    };
  }

  handleClick = () => {
    const { row, clickHandler } = this.state;
    clickHandler(row);
  }

  render() {
    const { tooltip, icon } = this.state;

    return (
      <React.Fragment>
        <a onClick={this.handleClick}><i className={icon}></i></a>&nbsp;&nbsp;<HelpIcon tooltip={tooltip} />
      </React.Fragment>
    )
  }
}
