import React from 'react';
import Badge from 'react-bootstrap/Badge';

import BootstrapTooltip from './BootstrapTooltip';

export default function Folder(props) {

  return (
    <li>
      <a href={`/jobs?folder_id=${props.id}`} style={{cursor: 'pointer'}}>
        <i className="icon-folder menu-icon"></i>
        <span className="nav-text">
          {props.name}&nbsp;&nbsp;<Badge variant="light">{props.count}</Badge>
        </span>
      </a>
    </li>
  );
}
