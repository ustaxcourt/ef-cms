import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const UserContactEditProgress = connect(
  {
    userContactEditProgressHelper: state.userContactEditProgressHelper,
  },
  function UserContactEditProgress({ userContactEditProgressHelper }) {
    return (
      <div>
        <div className="sticky-footer sticky-footer--space" />
        <div className="sticky-footer sticky-footer--container">
          <div className="usa-section grid-container padding-bottom-0 margin-top-1">
            <div aria-live="polite" className="progress-user-contact-edit">
              <h3>Updating contact info in all cases...</h3>
              <span className="progress-text">
                {userContactEditProgressHelper.percentComplete}% Complete
              </span>
              <div
                aria-hidden="true"
                className="progress-bar margin-right-2"
                style={{
                  background: `linear-gradient(to right, #2e8540 ${userContactEditProgressHelper.percentComplete}%, #fff 0% 100%)`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
