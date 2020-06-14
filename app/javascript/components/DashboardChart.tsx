import React from 'react';

import { Line, defaults } from 'react-chartjs-2';

export default class DashboardChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      options: props.options,
      width: props.width,
      height: props.height
    };
  }

  componentDidUpdate(prevProps, prevState)
  {
    if(prevProps.data != this.props.data || prevProps.options != this.props.options)
    {
      this.setState({data: this.props.data, options: this.props.options});
    }
  }

  render() {
    const { data, options, width, height } = this.state;

    return (
      <Line data={data} options={options} width={parseInt(width)} height={parseInt(height)} />
    );
  }
}
