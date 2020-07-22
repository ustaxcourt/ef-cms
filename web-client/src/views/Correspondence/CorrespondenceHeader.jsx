import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
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
                  icon="envelope-open"
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
                  icon="envelope-open"
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
