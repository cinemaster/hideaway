import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Display } from './components/Display';
import { getListState } from './controllers/selectors';
import { Store } from './components/Store';
import { updateBooksAction, resetBooksAction } from './controllers/actions';

function App({ updateBooks, resetBooks, state }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const handleSumbit = () => {
    if (title.trim() === '' || author.trim() === '') {
      setMessage('Fields cannot be empty');
    } else {
      setTitle('');
      setAuthor('');
      setMessage('');
      updateBooks(title, author);
    }
  };

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  const handleChangeAuthor = (event) => {
    setAuthor(event.currentTarget.value);
  };

  const handleReset = () => {
    setTitle('');
    setAuthor('');
    setMessage('');
    resetBooks();
  };

  return (
    <div style={{ display: 'table', width: '100%' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', width: '400px' }}>
          <Display
            onClickSubmit={handleSumbit}
            onClickReset={handleReset}
            onChangeTitle={handleChangeTitle}
            onChangeAuthor={handleChangeAuthor}
            title={title}
            author={author}
            message={message}
          />
        </div>
        <div styles={{ display: 'table-cell' }}>
          <Store state={state} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const listState = getListState(state);
  return { isLoading: listState.loading, data: listState.value, state };
};

const mapDispatchToProps = {
  updateBooks: updateBooksAction,
  resetBooks: resetBooksAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
