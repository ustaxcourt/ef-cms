import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CorrespondenceHeader = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    showAddCorrespondenceButton:
      state.caseDetailHelper.showAddCorrespondenceButton,
  },
  function CorrespondenceHeader({
    formattedCaseDetail,
    showAddCorrespondenceButton,
  }) {
    return (
      <React.Fragment>
        <div className="grid-container padding-0 docket-record-header">
          <div className="title grid-row">
            <div className="grid-col-10">
              <h1>Correspondence</h1>
            </div>
            <div className="tablet:grid-col-2 text-right hide-on-mobile add-correspondence-file">
              {showAddCorrespondenceButton && (
                <Button
                  link
                  aria-label="add correspondence file"
                  className="margin-right-0"
                  href={`/case-detail/${formattedCaseDetail.docketNumber}/upload-correspondence`}
                  icon="mail-bulk"
                  id="add-correspondence-file"
                >
                  Add Correspondence File
                </Button>
              )}
            </div>
            {showAddCorrespondenceButton && (
              <div className="only-small-screens">
                <Button
                  link
                  aria-hidden="true"
                  href={`/case-detail/${formattedCaseDetail.docketNumber}/upload-correspondence`}
                  icon="mail-bulk"
                >
                  Add Correspondence File
                </Button>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);

CorrespondenceHeader.displayName = 'CorrespondenceHeader';
