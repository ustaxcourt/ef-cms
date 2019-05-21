import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const WelcomeHeader = connect(
  {
    user: state.user,
  },
  ({ user }) => {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <h1 tabIndex="-1">Welcome, {user.name}</h1>
        </div>
      </div>
    );
  },
);
