import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { addSimpleAction } from 'redux/actions/simple';
import { addThunkAction } from 'redux/actions/thunk';
import {
  addHideawayStringAction,
  addSimpleHideawayAction,
} from 'redux/actions/hideaway';
import {
  addSimpleHideawayStateAction,
  addHideawayStateStringAction,
} from 'redux/actions/hideaway-state-management';

interface IStateToProps {
  total: string;
}

interface IDispatchToProps {
  addSimple: Function;
  addThunk: Function;
  addHideawayString: Function;
  addSimpleHideaway: Function;
  addSimpleHideawayState: Function;
  addHideawayStateString: Function;
}

type IProps = IStateToProps & IDispatchToProps;

const App: FunctionComponent<IProps> = ({
  total,
  addSimple,
  addThunk,
  addSimpleHideaway,
  addHideawayString,
  addSimpleHideawayState,
  addHideawayStateString,
}) => {
  return (
    <>
      <div>All keys: {total}</div>
      <div style={{ padding: 7 }}>
        <button type="button" onClick={() => addSimple('Update Simple')}>
          Simple
        </button>
        <button type="button" onClick={() => addThunk('Update Thunk')}>
          Thunk
        </button>
      </div>
      <div style={{ padding: 7 }}>
        <button
          type="button"
          onClick={() => addSimpleHideaway('Update simple with hideaway')}
        >
          Simple (using Hideaway)
        </button>
        <button
          type="button"
          onClick={() => addHideawayString('Update hideaway simple')}
        >
          Hideaway simple
        </button>
      </div>
      <div style={{ padding: 7 }}>
        <button
          type="button"
          onClick={() =>
            addSimpleHideawayState(
              'Update simple with hideaway with state management',
            )
          }
        >
          Simple with state manager(using Hideaway)
        </button>
        <button
          type="button"
          onClick={() =>
            addHideawayStateString(
              'Update hideaway simple with state management',
            )
          }
        >
          Hideaway simple with state manager
        </button>
      </div>
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
  addHideawayString: addHideawayStringAction,
  addSimpleHideaway: addSimpleHideawayAction,
  addSimpleHideawayState: addSimpleHideawayStateAction,
  addHideawayStateString: addHideawayStateStringAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
