import React from 'react';
import { connect } from 'react-redux';
import {
  getListAction,
  cleanListAction,
  fetchErrorAction,
} from './controllers/actions';
import { Display } from './components/Display';
import { getListState } from './controllers/selectors';
import { Store } from './components/Store';

function App({ getList, cleanList, isLoading, data, state, fetchError }) {
  return (
    <div style={{ display: 'table', width: '100%' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', width: '400px' }}>
          <Display
            isLoading={isLoading}
            data={data}
            onClickList={getList}
            onClickClean={cleanList}
            onClickFetchError={fetchError}
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
  getList: getListAction,
  cleanList: cleanListAction,
  fetchError: fetchErrorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
