import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PublicCaseDetailHeader = connect(
  {
    publicCaseDetailHeaderHelper: state.publicCaseDetailHeaderHelper,
  },
  ({ publicCaseDetailHeaderHelper }) => {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-8">
              <div>
                <h1 className="heading-2 captioned" tabIndex="-1">
                  Docket Number:{' '}
                  {publicCaseDetailHeaderHelper.docketNumberWithSuffix}
                </h1>
                <p className="margin-top-1 margin-bottom-0" id="case-title">
                  <span>{publicCaseDetailHeaderHelper.caseTitle}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
