import React from 'react';

import { formatDistanceToNow } from 'date-fns';

export default function DateTimeDistanceCell(props)
{
  const date = formatDistanceToNow(Date.parse(props.datetime)) + ' ago';
  return <div>{date}</div>;
}
