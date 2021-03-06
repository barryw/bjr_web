import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import PubSub from 'pubsub-js';

import HelpIcon from './HelpIcon';

import { setAsyncState } from './ReactUtils';

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
  tableLoadedToken;

  constructor(props) {
    super(props);
    this.state = {
      value: props.expression
    };
  }

  componentDidMount() {
    this.tableLoadedToken = PubSub.subscribe('TableLoaded', this.listen);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.tableLoadedToken);
  }

  listen = (msg, data) => {
    switch(msg)
    {
      case "TableLoaded":
        this.notify();
        break;
      default:
        break;
    }
  };

  onFilter = (e) => {
    this.setValue(e.target.value);
  };

  onClear = () => {
    this.setValue('');
  };

  setValue = (value: string) => {
    setAsyncState(this, {value: value})
    .then(() => {
      this.notify();
    });
  }

  notify = () => {
    PubSub.publish('SearchingJobs', this.state.value);
  }

  render() {
    const { value } = this.state;

    return (
      <React.Fragment>
        <HelpIcon tooltip={I18n.t('jobs.tooltips.filter_jobs')}/>&nbsp;&nbsp;
        <TextField id="search" type="text" value={value} placeholder="Filter By Name" onChange={this.onFilter} />
        <ClearButton type="button" onClick={this.onClear}>X</ClearButton>
      </React.Fragment>
    )
  }
}
