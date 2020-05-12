import React, { useState } from 'react';
import { getUrl } from '../controllers/selectors';
import {
  fetchListAction,
  cleanListAction,
  fetchErrorAction,
} from '../controllers/actions';
import { connect } from 'react-redux';
import { Action } from '../components/Action';

export const ActionComponent = ({
  state,
  handleClickLoad,
  handleCleanList,
  getWithError,
}) => {
  const [xkcdId, setXkcdId] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleChangeInput = (event) => {
    let value = parseInt(event.currentTarget.value.trim()) || 0;
    if (value <= 0 || value >= 1000) {
      value = value % 1000;
    }
    setXkcdId(value);
  };

  const handleClickImage = () => {
    const value = getUrl(state, xkcdId);
    if (value) {
      setImgUrl(value);
    }
  };

  const handleClickLoadSubmit = (event) => {
    if (xkcdId) {
      handleClickLoad(xkcdId);
    }
  };

  const handleClickError = () => {
    if (xkcdId) {
      getWithError(xkcdId);
    }
  };

  return (
    <Action
      xkcdId={xkcdId}
      imgUrl={imgUrl}
      onChangeInput={handleChangeInput}
      onClickLoad={handleClickLoadSubmit}
      onClickClean={handleCleanList}
      onClickError={handleClickError}
      onClickImage={handleClickImage}
    />
  );
};

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = {
  handleClickLoad: fetchListAction,
  handleCleanList: cleanListAction,
  getWithError: fetchErrorAction,
};

export const ActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionComponent);
