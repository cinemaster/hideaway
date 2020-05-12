import React from 'react';
import { connect } from 'react-redux';
import { ActionContainer } from './Action';
import { Store } from '../components/Store';

const AppComponent = ({ state }) => {
  return (
    <>
      <div
        style={{
          display: 'inline-block',
          width: '680px',
          verticalAlign: 'top',
        }}
      >
        <ActionContainer />
      </div>
      <div style={{ display: 'inline-block', paddingLeft: 14, width: '400px' }}>
        <Store state={state} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { state };
};

export const AppContainer = connect(mapStateToProps, {})(AppComponent);
