import React from 'react';
import { connect } from 'react-redux';
import { getListAction, cleanListAction } from './controllers/actions';
import { Display } from './component';
import { getListState } from './controllers/selectors';

function App({ getList, cleanList, isLoading, data }) {
  return (
    <Display
      isLoading={isLoading}
      data={data}
      onClickList={getList}
      onClickClean={cleanList}
    />
  );
}

const mapDispatchToProps = {
  getList: getListAction,
  cleanList: cleanListAction,
};

function mapStateToProps(state) {
  const listState = getListState(state);
  return { isLoading: listState.loading, data: listState.value };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
