import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AdvancedSearchHeader = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
  },
  function AdvancedSearchHeader({ advancedSearchHelper }) {
    return (
      <div className="big-blue-header">
        <div className="grid-container display-flex space-between flex-align-center">
          <h1 tabIndex={-1}>Search</h1>
          {advancedSearchHelper.showFeedbackButton && (
            <div>
              <Button
                className="usa-button--outline margin-right-0"
                href={advancedSearchHelper.feedBackUrl}
                icon="comment-dots"
                iconColor="dark-blue"
                target="_blank"
              >
                Send Feedback
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

AdvancedSearchHeader.displayName = 'AdvancedSearchHeader';
