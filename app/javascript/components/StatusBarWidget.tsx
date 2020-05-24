import React from 'react';

export default function StatusBarWidget(props) {
  return (
    <div className="col-3">
      <div className="card card-widget">
        <div className={`card-body ${props.gradient}`}>
          <div className="media">
            <span className="card-widget__icon"><i className={`icon-${props.icon}`}></i></span>
            <div className="media-body">
              <h2 className="card-widget__title">{props.value}</h2>
              <h5 className="card-widget__subtitle">{props.subtitle}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
