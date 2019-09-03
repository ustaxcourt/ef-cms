import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';

export const PrintableTrialCalendar = connect(
  {
    formattedTrialSession: state.formattedTrialSessionDetails,
    gotoTrialSessionDetailSequence: sequences.gotoTrialSessionDetailSequence,
    trialSessionId: state.trialSessionId,
  },
  ({
    formattedTrialSession,
    gotoTrialSessionDetailSequence,
    trialSessionId,
  }) => {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="margin-bottom-1">
              <h1 tabIndex="-1">{formattedTrialSession.trialLocation}</h1>
              <span
                className={`usa-tag ${
                  !formattedTrialSession.isCalendared ? 'ustc-tag--yellow' : ''
                }`}
              >
                <span aria-hidden="true">
                  {formattedTrialSession.formattedTerm}:{' '}
                  {formattedTrialSession.status}
                </span>
              </span>
            </div>
            <p className="margin-y-0" id="case-title">
              <span>{formattedTrialSession.formattedStartDate}</span>
            </p>
          </div>
        </div>

        <div className="grid-container print-docket-record">
          <button
            className="usa-button usa-button--unstyled margin-bottom-3"
            onClick={() => {
              gotoTrialSessionDetailSequence({
                trialSessionId,
              });
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Session Information
          </button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
