import { IRootState, THideawayState } from 'contracts/redux';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import {
  addHideawaySimpleAction,
  addHideawayThunkAction,
} from 'redux/actions/hideaway';
import {
  addHideawaySimpleMultilevelAction,
  addHideawaySimpleMultilevelStateAction,
  addHideawayThunkMultilevelAction,
  addHideawayThunkMultilevelStateAction,
  addHideawayThunkMultilevelStateErrorAction,
} from 'redux/actions/hideaway-multilevel';
import {
  addHideawayNestedStateAction,
  addHideawayNestedStateErrorAction,
} from 'redux/actions/hideaway-nested';
import {
  addHideawaySimpleStateAction,
  addHideawayThunkStateAction,
  addHideawayThunkStateErrorAction,
} from 'redux/actions/hideaway-state';
import { addSimpleAction } from 'redux/actions/simple';
import { addThunkApiAction } from 'redux/actions/thunk';
import {
  getHideawayMultilevelSelector,
  getHideawayNestedMultilevelSelector,
  getHideawaySelector,
  getHideawayStateMultilevelSelector,
  getHideawayStateSelector,
} from 'redux/selectors/hideaway';
import './App.css';

interface IStateToProps {
  simple: string;
  thunk: object;
  hideawaySimple: THideawayState;
  hideawayState: THideawayState;
  itIsAMultilevelSimple: THideawayState;
  itIsAMultilevelState: THideawayState;
  itIsAMultilevelNested: THideawayState;
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
  addHideawayNestedState: Function;
  addHideawayNestedStateError: Function;
}

type IProps = IStateToProps & IDispatchToProps;

const App: FunctionComponent<IProps> = ({
  simple,
  thunk,
  hideawaySimple,
  hideawayState,
  itIsAMultilevelSimple,
  itIsAMultilevelState,
  itIsAMultilevelNested,
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
  addHideawayNestedState,
  addHideawayNestedStateError,
}) => {
  const stateResult = {
    simple,
    thunk,
    hideawaySimple,
    hideawayState,
    itIsAMultilevelSimple,
    itIsAMultilevelState,
    itIsAMultilevelNested,
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
          <span>Hideaway nested</span>
          <div>
            <div>
              <button
                type="button"
                onClick={() =>
                  addHideawayNestedState('Update A => B => C (ON)', {
                    keys: {
                      a: 'mock A',
                      b: 'mock B',
                      c: 'mock C',
                    },
                    path: ['a', 'b', 'c'],
                  })
                }
              >
                A -&gt; B -&gt; C (ON)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayNestedState('Update A => B => C (OFF)', {
                    keys: {
                      a: 'mock A',
                      b: 'mock B',
                      c: 'mock C',
                    },
                    path: ['a', 'b', 'c'],
                  })
                }
              >
                A -&gt; B -&gt; C (OFF)
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayNestedStateError('Update A => B => C (ERRO)', {
                    keys: {
                      a: 'mock A',
                      b: 'mock B',
                      c: 'mock C',
                    },
                    path: ['a', 'b', 'c'],
                  })
                }
              >
                A -&gt; B -&gt; C (ERROR)
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  addHideawayNestedState('Update A => B => D (ON)', {
                    keys: {
                      a: 'mock A',
                      b: 'mock B',
                    },
                    path: ['a', 'b', 'd'],
                  })
                }
              >
                A -&gt; B -&gt; D (ON) - Missing D
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayNestedState('Update  A => B => D (OFF)', {
                    keys: {
                      a: 'mock A',
                      b: 'mock B',
                    },
                    path: ['a', 'b', 'd'],
                  })
                }
              >
                A -&gt; B -&gt; D (ON) - Missing D
              </button>
              <button
                type="button"
                onClick={() =>
                  addHideawayNestedStateError('Update  A => B => D (ERROR)', {
                    keys: {
                      a: 'mock A',
                      b: 'mock B',
                    },
                    path: ['a', 'b', 'd'],
                  })
                }
              >
                A -&gt; B -&gt; D (ON) - Missing D
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
    itIsAMultilevelNested: getHideawayNestedMultilevelSelector(state),
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
  addHideawayNestedState: addHideawayNestedStateAction,
  addHideawayNestedStateError: addHideawayNestedStateErrorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
