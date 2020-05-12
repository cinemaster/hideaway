import React from 'react';

export const Display = ({
  isLoading,
  data,
  onClickList,
  onClickClean,
  onClickFetchError,
}) => (
  <div>
    <div>
      <button onClick={onClickList} style={{ marginRight: 14 }}>
        Load data
      </button>
      <button onClick={onClickClean} style={{ marginRight: 14 }}>
        Clean data
      </button>
      <button onClick={onClickFetchError}>Error</button>
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
