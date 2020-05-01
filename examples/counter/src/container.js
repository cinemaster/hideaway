import React from "react";
import { connect } from "react-redux";
import { incrementAction, decrementAction } from "./controllers/actions";
import Counter from "./component";
import { getCounter } from "./controllers/selectors";

const App = ({ increment, decrement, state }) => {
  const value = getCounter(state);
  return (
    <Counter value={value} onIncrement={increment} onDecrement={decrement} />
  );
};

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = {
  increment: incrementAction,
  decrement: decrementAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
