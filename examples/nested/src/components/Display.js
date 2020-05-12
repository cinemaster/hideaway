import React from 'react';

export const Display = ({
  onClickSubmit,
  onClickReset,
  onChangeTitle,
  onChangeAuthor,
  title,
  author,
  message,
}) => (
  <div>
    <div>
      <div>
        <p>title</p>
        <input value={title} onChange={onChangeTitle} />
      </div>
      <div>
        <p>author</p>
        <input value={author} onChange={onChangeAuthor} />
      </div>
      <div>
        <br />
        <button onClick={onClickSubmit} style={{ marginRight: 14 }}>
          Submit
        </button>
        <button onClick={onClickReset} style={{ marginRight: 14 }}>
          Reset
        </button>
        <br />
        <p>{message}</p>
      </div>
    </div>
  </div>
);
