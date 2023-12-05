import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SealedCaseDetail = connect(
  {
    sealedCaseDetailHelper: state.sealedCaseDetailHelper,
  },
  function SealedCaseDetail({ sealedCaseDetailHelper }) {
    return (
      <>
        {sealedCaseDetailHelper.isCaseSealed && (
          <>
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
            <div className="big-blue-header margin-bottom-0">
              <div className="grid-container">
                <div className="grid-row">
                  <div className="tablet:grid-col-8">
                    <div>
                      <h1 className="heading-2 captioned" tabIndex={-1}>
                        Docket Number:{' '}
                        {sealedCaseDetailHelper.docketNumberWithSuffix}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-container">
              <p className="margin-top-5 margin-bottom-5">
                This case is sealed and not accessible to the public.
              </p>
            </div>
          </>
        )}
      </>
    );
  },
);

SealedCaseDetail.displayName = 'SealedCaseDetail';
