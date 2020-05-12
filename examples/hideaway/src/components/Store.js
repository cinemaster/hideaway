import React from 'react';

export const Store = ({ state }) => (
  <div>
    <p>Store</p>
    <pre>{JSON.stringify(state, null, 4)}</pre>
  </div>
);
