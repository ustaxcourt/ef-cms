import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseNotes = connect(
  {
    caseDetail: state.formattedCaseDetail,
  },
  ({ caseDetail }) => {
    caseDetail.notes = 'These are some notes, yo.';
    return (
      <div className="case-notes">
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  {caseDetail.notes && (
                    <button className="usa-button usa-button--unstyled float-right">
                      <FontAwesomeIcon icon="plus-circle" />
                      Add Note
                    </button>
                  )}
                  <h3 className="display-inline">Judge’s Notes</h3>
                  {caseDetail.notes && (
                    <>
                      <div className="margin-top-1  margin-bottom-4">
                        {caseDetail.notes}
                      </div>
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <button className="usa-button usa-button--unstyled">
                            <FontAwesomeIcon icon="edit"></FontAwesomeIcon>Edit
                            Note
                          </button>
                        </div>
                        <div className="tablet:grid-col-6 text-align-right">
                          <button className="usa-button usa-button--unstyled red-warning">
                            <FontAwesomeIcon icon="times-circle"></FontAwesomeIcon>
                            Delete Note
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
