import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type PublicMobileTrialSessionsDataRowProps = {
  startDate: string;
  trialSessionId: string;
  judgeName: string;
  proceedingType: string;
  sessionType: string;
  swingSession: boolean;
  trialLocation: string;
};

export const PublicMobileTrialSessionsDataRow = function ({
  judgeName,
  proceedingType,
  sessionType,
  startDate,
  swingSession,
  trialLocation,
  trialSessionId,
}: PublicMobileTrialSessionsDataRowProps) {
  return (
    <>
      <div className="padding-bottom-1 grid-row">
        <div className="grid-col-6 padding-bottom-1">
          <div className="text-semibold">Start Date</div>
          <div className="padding-bottom-2">{startDate}</div>

          <div className="text-semibold">Proceeding Type</div>
          <div className="padding-bottom-2">{proceedingType}</div>

          <div className="text-semibold">Judge</div>
          <div>{judgeName}</div>
        </div>
        <div className="grid-col-6 padding-bottom-1">
          <div className="text-semibold">Location</div>
          <div className="padding-bottom-2">
            {swingSession && (
              <span className="padding-right-1">
                <FontAwesomeIcon
                  className="fa-icon-blue"
                  icon="link"
                  size="sm"
                  title="Swing session: will be held in two cities"
                />
              </span>
            )}
            <a href={`/trial-session-detail/${trialSessionId}`}>
              {trialLocation}
            </a>
          </div>

          <div className="text-semibold">Session Type</div>
          <div>{sessionType}</div>
        </div>
      </div>
    </>
  );
};
