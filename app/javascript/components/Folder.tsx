import React from 'react';
import BootstrapTooltip from './BootstrapTooltip';
import Badge from 'react-bootstrap/Badge';

export default function Folder(props) {

  return (
    <li>
      <a aria-expanded="false">
        <i className="icon-folder menu-icon"></i>
        <span className="nav-text">
          {props.name}&nbsp;&nbsp;<Badge variant="light">{props.count}</Badge>
        </span>
      </a>
    </li>
  );
}
