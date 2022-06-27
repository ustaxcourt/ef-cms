import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SealedCaseDetailHeader = connect(
  {
    sealedCaseDetailHeaderHelper: state.sealedCaseDetailHeaderHelper,
  },
  function SealedCaseDetailHeader({ sealedCaseDetailHeaderHelper }) {
    return (
      <>
        {sealedCaseDetailHeaderHelper.isCaseSealed && (
          <div className="red-warning-header sealed-banner">
            <div className="grid-container text-bold">
              <FontAwesomeIcon
                className="margin-right-1 icon-sealed"
                icon="lock"
                size="1x"
              />
              This case is sealed
            </div>
          </div>
        )}
        <div className="big-blue-header margin-bottom-0">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-8">
                <div>
                  <h1 className="heading-2 captioned" tabIndex="-1">
                    Docket Number:{' '}
                    {sealedCaseDetailHeaderHelper.docketNumberWithSuffix}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
