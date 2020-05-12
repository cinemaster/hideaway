import React, { useState } from 'react';

export const Action = ({
  xkcdId,
  imgUrl,
  onChangeInput,
  onClickLoad,
  onClickClean,
  onClickError,
  onClickImage,
}) => (
  <div>
    <div>
      <p>xkcd Id (1 ~ 1000)</p>
      <input
        type="number"
        min="1"
        max="100"
        value={xkcdId}
        onChange={onChangeInput}
        style={{ marginRight: 14 }}
      />
      <button onClick={onClickLoad} style={{ marginRight: 14 }}>
        Load data
      </button>
      <button onClick={onClickClean} style={{ marginRight: 14 }}>
        Clean data
      </button>
      <button onClick={onClickError} style={{ marginRight: 14 }}>
        Error
      </button>
      <button onClick={onClickImage}>Load Image</button>
    </div>
    <br />
    <div>{imgUrl ? <img src={imgUrl} width={670} /> : <>No Image</>}</div>
  </div>
);
