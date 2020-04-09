import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { addSimpleAction } from '../redux/actions/simple';

interface StateToProps {
  total: object;
}

interface DispatchToProps {
  addSimple: Function;
}

type IProps = StateToProps & DispatchToProps;

const App: FunctionComponent<IProps> = ({ total, addSimple }) => {
  return (
    <button type="button" onClick={() => addSimple('WOW')}>
      {Object.keys(total)}
    </button>
  );
};

const mapStateToProps = (state: object) => {
  return {
    total: state,
  };
};

const mapDispatchToProps = {
  addSimple: addSimpleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
