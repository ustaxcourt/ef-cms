import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PrintableTrialCalendar = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    gotoTrialSessionDetailSequence: sequences.gotoTrialSessionDetailSequence,
    trialSessionId: state.trialSession.trialSessionId,
  },
  function PrintableTrialCalendar({
    formattedTrialSessionDetails,
    gotoTrialSessionDetailSequence,
    trialSessionId,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="margin-bottom-1">
              <h1 tabIndex={-1}>
                {formattedTrialSessionDetails.trialLocation}
              </h1>
              <span
                className={classNames(
                  'usa-tag',
                  !formattedTrialSessionDetails.isCalendared &&
                    'ustc-tag--yellow',
                )}
              >
                <span aria-hidden="true">
                  {formattedTrialSessionDetails.formattedTerm}:{' '}
                  {formattedTrialSessionDetails.status}
                </span>
              </span>
            </div>
            <p className="margin-y-0" id="case-title">
              <span>{formattedTrialSessionDetails.formattedStartDate}</span>
            </p>
          </div>
        </div>

        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            onClick={() => {
              gotoTrialSessionDetailSequence({
                trialSessionId,
              });
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Session Information
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);

PrintableTrialCalendar.displayName = 'PrintableTrialCalendar';
