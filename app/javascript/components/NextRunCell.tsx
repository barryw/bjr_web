import React from 'react';

import { formatDistanceToNow } from 'date-fns';

export default function NextRunCell(props)
{
  return props.row.running ? <div className="spinner-border spinner-border-sm"></div> : (props.row.enabled ? (new Date() > Date.parse(props.row.next_run) ? 'soon' : 'in ' + formatDistanceToNow(Date.parse(props.row.next_run))) : 'never')
}
