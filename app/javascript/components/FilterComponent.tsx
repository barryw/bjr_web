import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import PubSub from 'pubsub-js';

import HelpIcon from './HelpIcon';

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 1px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 32px;
  width: 32px;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

export default class FilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  onFilter = (e) => {
    this.setValue(e.target.value);
  };

  onClear = () => {
    this.setValue('');
  };

  setValue = (value: string) => {
    this.setAsyncState({value: value})
    .then(() => {
      PubSub.publish('SearchingJobs', this.state.value);
    });
  }

  render() {
    return (
      <span>
        <HelpIcon tooltip="You can search specific fields by prefixing your search with 'name:', 'tags:', 'timezone:' or 'command:'. You can also search based on the state of a job using 'running', 'stopped', 'enabled', 'disabled', 'succeeded' or 'failed'."/>&nbsp;&nbsp;
        <TextField id="search" type="text" value={this.state.value} placeholder="Filter By Name" onChange={this.onFilter} />
        <ClearButton type="button" onClick={this.onClear}>X</ClearButton>
      </span>
    )
  }
}
