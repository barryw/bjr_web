import React from 'react';

export default function EditJobCell(props) {
  return (
    <a data-remote="true" href={`/jobs/${props.id}/edit`}><i className="icon-note"></i></a>
  )
}
