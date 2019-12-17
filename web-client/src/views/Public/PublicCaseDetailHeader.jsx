import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
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
              <div className="margin-bottom-1">
                <h1 className="heading-2 captioned" tabIndex="-1">
                  <CaseLink
                    docketNumber={publicCaseDetailHeaderHelper.docketNumber}
                  >
                    Docket Number:{' '}
                    {publicCaseDetailHeaderHelper.docketNumberWithSuffix}
                  </CaseLink>
                </h1>
                <p className="margin-y-0" id="case-title">
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
