import React from 'react';

import { pSBC } from './ReactUtils';

export default function TrendIndicator(props)
{
  let trend = props.trend;

  let neutral = "000000";
  let good = "5ED758"
  let bad = "FF4449"

  let color = neutral;
  let angle = 270;

  let max = .5;
  let angleInterval = (max / 90);
  let colorInterval = (max / 100);

  if(trend !== 0) {
    if(trend < 0) {
      if(trend < -max) {
        color = good;
        angle = 360;
      } else {
        angle = Math.round(trend / angleInterval) + 270;
      }
    } else {
      if(trend > max) {
        color = bad;
        angle = 180;
      } else {
        let val = Math.abs(trend);
        angle = 270 - Math.round(val / angleInterval);
      }
    }
  }

  const trendIndicatorStyle = {
    overflow: 'visible',
    padding: '1px'
  };

  return (
    <svg
      aria-hidden="true"
      width="1.7em"
      height="1.7em"
      viewBox="0 0 1024 1024"
      style={trendIndicatorStyle}
    >
      <path
        d="M0 512q0 139 68.5 257T255 955.5t257 68.5 257-68.5T955.5 769t68.5-257-68.5-257T769 68.5 512 0 255 68.5 68.5 255 0 512zm961 0q0 91-35.5 174t-96 143T686 924.5 512 960t-174-35.5T195 829 99.5 686 64 512t35.5-174T195 195t143-95.5T512 64t174 35.5T829.5 195t96 143T961 512zM480 288v360L364 532q-3-3-7-5t-8-3-8-1-8 1-7.5 3-6.5 5q-18 18-5 39 2 4 5 7l194 189 194-189q9-10 9-23t-9.5-22.5T684 523t-23 9L544 650V288q0-14-9.5-23t-22.5-9q-7 0-13 2.5t-10 6.5-6.5 10-2.5 13z"
        fill={`#${color}`} transform={`rotate(${angle} 512 512)`}
      />
      <path fill="rgba(0, 0, 0, 0)" d="M0 0h1024v1024H0z" />
    </svg>
  );
}
