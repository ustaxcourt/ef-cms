import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

export const AdvancedSearchHeader = connect(
  {
    feedBackUrl: props.feedBackUrl,
  },
  function AdvancedSearchHeader({ feedBackUrl }) {
    return (
      <div className="big-blue-header">
        <div className="grid-container display-flex space-between flex-align-center">
          <h1 tabIndex="-1">Search</h1>
          <div>
            <Button
              className="usa-button--outline margin-right-0"
              href={feedBackUrl}
              icon="comment-dots"
              iconColor="dark-blue"
            >
              Send Feedback
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
