import React from 'react';
import HelpIcon from './HelpIcon';

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
      <React.Fragment>
        <a onClick={this.handleClick}><i className="icon-note"></i></a>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.edit_job')} />
      </React.Fragment>
    )
  }
}
