import React from 'react';

type PublicMobileTrialSessionsDataRowProps = {
  startDate: string;
  trialSessionId: string;
  judgeName: string;
  proceedingType: string;
  sessionType: string;
  trialLocation: string;
};

export const PublicMobileTrialSessionsDataRow = function ({
  judgeName,
  proceedingType,
  sessionType,
  startDate,
  trialLocation,
  trialSessionId,
}: PublicMobileTrialSessionsDataRowProps) {
  return (
    <>
      <div className="padding-bottom-1 grid-row">
        <div className="grid-col-6 padding-bottom-1">
          <div className="padding-bottom-2">
            <div>
              <b>Start Date</b>
            </div>
            <div>{startDate}</div>
          </div>
          <div className="padding-bottom-2">
            <div>
              <b>Proceeding Type</b>
            </div>
            <div>{proceedingType}</div>
          </div>
          <div>
            <div>
              <b>Judge</b>
            </div>
            <div>{judgeName}</div>
          </div>
        </div>
        <div className="grid-col-6 padding-bottom-1">
          <div className="padding-bottom-2">
            <div>
              <b>Start Date</b>
            </div>
            <a href={`/trial-session-detail/${trialSessionId}`}>
              {trialLocation}
            </a>
          </div>
          <div>
            <div>
              <b>Session Type</b>
            </div>
            <div>{sessionType}</div>
          </div>
        </div>
      </div>
    </>
  );
};
