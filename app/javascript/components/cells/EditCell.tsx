import React from 'react';

import HelpIcon from '../HelpIcon';

export default class EditCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      tooltip: props.tooltip,
      clickHandler: props.clickHandler
    };
  }

  handleClick = () => {
    const { row, clickHandler } = this.state;
    clickHandler(row);
  }

  render() {
    const { tooltip } = this.state;

    return (
      <React.Fragment>
        <a onClick={this.handleClick}><i className="icon-note"></i></a>&nbsp;&nbsp;<HelpIcon tooltip={tooltip} />
      </React.Fragment>
    )
  }
}
