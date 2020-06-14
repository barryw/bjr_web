import React from 'react';

import { formatDistanceToNow } from 'date-fns';

export default function LastRunCell(props)
{
  const date = props.row.running ? 'running' : (props.row.last_run ? formatDistanceToNow(Date.parse(props.row.last_run)) + ' ago' : 'never');
  return <div>{date}</div>;
}
