import React from 'react';
import Form from 'react-bootstrap/Form';

export default class SelectBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items
    };
  }

  render() {
    const { items } = this.state;

    const options = items.map((item) => <option value={item.val}>{item.display}</option> );

    return (
      <Form.Control as="select">
        {options}
      </Form.Control>
    );
  }
}
