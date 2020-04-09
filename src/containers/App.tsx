import { IRootState, THideawayState } from 'contracts/redux';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import {
  addHideawayThunkAction,
  addHideawaySimpleAction,
} from 'redux/actions/hideaway';
import {
  addHideawayThunkStateAction,
  addHideawaySimpleStateAction,
  addHideawayThunkStateErrorAction,
} from 'redux/actions/hideaway-state';
import {
  addHideawaySimpleMultilevelAction,
  addHideawayThunkMultilevelAction,
  addHideawaySimpleMultilevelStateAction,
  addHideawayThunkMultilevelStateAction,
  addHideawayThunkMultilevelStateErrorAction,
} from 'redux/actions/hideaway-multilevel';
import {
  getHideawaySelector,
  getHideawayStateSelector,
  getHideawayMultilevelSelector,
  getHideawayStateMultilevelSelector,
} from 'redux/selectors/hideaway';
import { addSimpleAction } from 'redux/actions/simple';
import { addThunkApiAction } from 'redux/actions/thunk';
import './App.css';

interface IStateToProps {
  simple: string;
  thunk: object;
  hideawaySimple: THideawayState;
  hideawayState: object;
  itIsAMultilevelSimple: THideawayState;
  itIsAMultilevelState: THideawayState;
}

interface IDispatchToProps {
  addSimple: Function;
  addThunk: Function;
  addHideawaySimple: Function;
  addHideawayThunk: Function;
  addHideawaySimpleState: Function;
  addHideawayThunkState: Function;
  addHideawayThunkStateError: Function;
  addHideawaySimpleMultilevel: Function;
  addHideawayThunkMultilevel: Function;
  addHideawaySimpleMultilevelState: Function;
  addHideawayThunkMultilevelState: Function;
  addHideawayThunkMultilevelStateError: Function;
}

type IProps = IStateToProps & IDispatchToProps;

const App: FunctionComponent<IProps> = ({
  simple,
  thunk,
  hideawaySimple,
  hideawayState,
  itIsAMultilevelSimple,
  itIsAMultilevelState,
  addSimple,
  addThunk,
  addHideawaySimple,
  addHideawayThunk,
  addHideawaySimpleState,
  addHideawayThunkState,
  addHideawayThunkStateError,
  addHideawaySimpleMultilevel,
  addHideawayThunkMultilevel,
  addHideawaySimpleMultilevelState,
  addHideawayThunkMultilevelState,
  addHideawayThunkMultilevelStateError,
}) => {
  const stateResult = {
    simple,
    thunk,
    hideawaySimple,
    hideawayState,
    itIsAMultilevelSimple,
    itIsAMultilevelState,
  };
  return (
    <div className="grid-container">
      <div className="left">
        <span>Basic</span>
        <div>
          <div>
            <button
              type="button"
              onClick={() => addSimple('Update Simple to ON')}
            >
              Simple (ON)
            </button>
            <button
              type="button"
              onClick={() => addSimple('Update Simple to OFF')}
            >
              Simple (OFF)
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => addThunk('Update Thunk to ON')}
            >
              Thunk (ON)
            </button>
            <button
              type="button"
              onClick={() => addThunk('Update Thunk to OFF')}
            >
              Thunk (OFF)
            </button>
          </div>
        </div>
        <span>Hideaway (based on the basic)</span>
        <div>
          <div>
            <button
              onClick={() => addHideawaySimple('Update Simple to ON')}
              type="button"
            >
              Simple (ON)
            </button>
            <button
              onClick={() => addHideawaySimple('Update Simple to OFF')}
              type="button"
            >
              Simple (OFF)
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => addHideawayThunk('Update Thunk to ON')}
            >
              Thunk (ON)
            </button>
            <button
              type="button"
              onClick={() => addHideawayThunk('Update Thunk to OFF')}
            >
              Thunk (OFF)
            </button>
          </div>
          <span>Hideaway (state management)</span>
          <div>
            <div>
              <button
                type="button"
                onClick={() => addHideawaySimpleState('Update Simple to ON')}
              >
                Simple (ON)
              </button>
              <button
                type="button"
                onClick={() => addHideawaySimpleState('Update Simple to OFF')}
              >
                Simple (OFF)
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => addHideawayThunkState('Update Thunk to ON')}
              >
                Thunk (ON)
              </button>
              <button
                type="button"
                onClick={() => addHideawayThunkState('Update Thunk to OFF')}
              >
                Thunk (OFF)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayThunkStateError('Update Thunk to ERROR')
                }
              >
                Thunk (ERROR)
              </button>
            </div>
          </div>
          <span>Hideaway multilevel</span>
          <div>
            <div>
              <button
                type="button"
                onClick={() =>
                  addHideawaySimpleMultilevel('Update Simple to ON')
                }
              >
                Simple (ON)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawaySimpleMultilevel('Update Simple to OFF')
                }
              >
                Simple (OFF)
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => addHideawayThunkMultilevel('Update Thunk to ON')}
              >
                Thunk (ON)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayThunkMultilevel('Update Thunk to OFF')
                }
              >
                Thunk (OFF)
              </button>
            </div>
          </div>
          <span>Hideaway multilevel state</span>
          <div>
            <div>
              <button
                type="button"
                onClick={() =>
                  addHideawaySimpleMultilevelState('Update Simple to ON')
                }
              >
                Simple (ON)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawaySimpleMultilevelState('Update Simple to OFF')
                }
              >
                Simple (OFF)
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  addHideawayThunkMultilevelState('Update Thunk to ON')
                }
              >
                Thunk (ON)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayThunkMultilevelState('Update Thunk to OFF')
                }
              >
                Thunk (OFF)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayThunkMultilevelStateError('Update Thunk to ERROR')
                }
              >
                Thunk (ERROR)
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <pre>{JSON.stringify(stateResult, null, 2)}</pre>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IRootState) => {
  return {
    simple: state.simple,
    thunk: state.thunk,
    hideawaySimple: getHideawaySelector(state),
    hideawayState: getHideawayStateSelector(state),
    itIsAMultilevelSimple: getHideawayMultilevelSelector(state),
    itIsAMultilevelState: getHideawayStateMultilevelSelector(state),
  };
};

const mapDispatchToProps = {
  addSimple: addSimpleAction,
  addThunk: addThunkApiAction,
  addHideawaySimple: addHideawaySimpleAction,
  addHideawayThunk: addHideawayThunkAction,
  addHideawaySimpleState: addHideawaySimpleStateAction,
  addHideawayThunkState: addHideawayThunkStateAction,
  addHideawayThunkStateError: addHideawayThunkStateErrorAction,
  addHideawaySimpleMultilevel: addHideawaySimpleMultilevelAction,
  addHideawayThunkMultilevel: addHideawayThunkMultilevelAction,
  addHideawaySimpleMultilevelState: addHideawaySimpleMultilevelStateAction,
  addHideawayThunkMultilevelState: addHideawayThunkMultilevelStateAction,
  addHideawayThunkMultilevelStateError: addHideawayThunkMultilevelStateErrorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
