import React from 'react';

export default function BooleanCell(props)
{
  return <span className="card-widget__icon2"><i className={`icon-${props.boolval ? 'check' : 'close'} text-${props.boolval ? 'success' : 'danger'}`}></i></span>
}
