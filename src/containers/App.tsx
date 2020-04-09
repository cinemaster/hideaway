import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { addSimpleAction } from 'redux/actions/simple';
import { addThunkAction } from 'redux/actions/thunk';

interface StateToProps {
  total: string;
}

interface DispatchToProps {
  addSimple: Function;
  addThunk: Function;
}

type IProps = StateToProps & DispatchToProps;

const App: FunctionComponent<IProps> = ({ total, addSimple, addThunk }) => {
  return (
    <>
      <div>All keys: {total}</div>
      <button type="button" onClick={() => addSimple('Update Simple')}>
        Simple
      </button>
      <button type="button" onClick={() => addThunk('Update Thunk')}>
        Thunk
      </button>
    </>
  );
};

const mapStateToProps = (state: object) => {
  return {
    total: Object.keys(state).join(', '),
  };
};

const mapDispatchToProps = {
  addSimple: addSimpleAction,
  addThunk: addThunkAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
