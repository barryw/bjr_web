import React from 'react';
import Form from 'react-bootstrap/Form';

export default class SelectBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      onChange: props.onChange,
      value: props.value
    };
  }

  handleChange = (e) => {
    const { onChange } = this.state;
    onChange(e);
  }

  componentDidUpdate(prevProps, prevState)
  {
    if(prevProps.value != this.props.value)
    {
      this.setState({value: this.props.value});
    }
  }

  render() {
    const { value, items } = this.state;
    const options = items.map((item) => <option key={item.val} value={item.val}>{item.display}</option> );

    return (
      <Form.Control value={value} as="select" onChange={this.handleChange} >
        {options}
      </Form.Control>
    );
  }
}
