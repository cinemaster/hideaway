import React from 'react';

export const Display = ({ isLoading, data, onClickList, onClickClean }) => (
  <div>
    <div>
      <button onClick={onClickList} style={{ marginRight: 14 }}>
        Load data
      </button>
      <button onClick={onClickClean}>Clean data</button>
    </div>
    <pre>
      {isLoading
        ? 'Loading'
        : (data &&
            data.map((item, index) => <div key={index}>{item}</div>)) || (
            <p>No record</p>
          )}
    </pre>
  </div>
);
