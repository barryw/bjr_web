import React from 'react';

import { format, parseISO } from 'date-fns';

export default function DateTimeCell(props)
{
  if(props.date == null) {
    return <div>{props.emptyVal}</div>;
  } else {
    const iso = parseISO(props.date);
    const date = format(iso, 'yyyy-MM-dd hh:mm:ss bbbb')
    return <div>{date}</div>;
  }
}
