import React from 'react';
import BootstrapTooltip from './BootstrapTooltip';
import Badge from 'react-bootstrap/Badge';

export default function Folder(props) {

  return (
    <li>
      <a><i className="icon-folder menu-icon"></i>{props.name}&nbsp;&nbsp;<Badge variant="light">{props.count}</Badge></a>
    </li>
  );
}
