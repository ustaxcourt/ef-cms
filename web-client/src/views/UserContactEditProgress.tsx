import { ProgressBar } from '../ustc-ui/ProgressBar/ProgressBar';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
            <div className="progress-user-contact-edit">
              <h3 data-testid="progress-description" id="progress-description">
                Updating contact info in all cases. Please be patient as this
                may take awhile.
              </h3>
              <ProgressBar
                aria-labelledby="progress-description"
                value={userContactEditProgressHelper.percentComplete}
              />
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

UserContactEditProgress.displayName = 'UserContactEditProgress';
