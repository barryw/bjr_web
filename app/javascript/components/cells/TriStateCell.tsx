import React from 'react';

export default function TriStateCell(props)
{
  let icon = '';
  let color = '';

  switch(props.value) {
    case -1:
      icon = 'close';
      color = 'danger';
      break;
    case 0:
      icon = 'question';
      color = 'light';
      break;
    case 1:
      icon = 'check';
      color = 'success';
      break;
  }

  return (
    <span className="card-widget__icon2">
      <i className={`icon-${icon} text-${color}`}></i>
    </span>
  );
}
