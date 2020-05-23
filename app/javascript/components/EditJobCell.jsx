import React from 'react';

export default class EditJobCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
  }

  render() {
    const { id } = this.state;

    return (
      <a data-remote="true" href={`/jobs/${id}/edit`}><i className="icon-note"></i></a>
    )
  }
};
