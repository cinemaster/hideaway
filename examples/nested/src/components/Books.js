import React from 'react';

export const Books = ({ value }) => (
  <div>
    <p>Books</p>
    <pre>{JSON.stringify(value, null, 4)}</pre>
  </div>
);
