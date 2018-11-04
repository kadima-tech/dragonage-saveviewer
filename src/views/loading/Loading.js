// <div>
//   <div class="text">
//   <h2>{{stateText}}</h2>
//   </div>
// </div>

import React from 'react';


export const Loading = ({ uploadState }) => (
  <div>
    <h2>{uploadState}</h2>
  </div>
);
