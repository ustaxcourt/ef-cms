import { Tag } from '@web-client/dawson-ui/ui/tag';
import React from 'react';

export const TrialSessionDetailsHeader = ({
  formattedTrialSessionDetails,
}: {
  formattedTrialSessionDetails: {
    trialLocation?: string;
    formattedTerm?: string;
    sessionStatus?: string;
    formattedStartDate: string;
    formattedEstimatedEndDate?: string;
  };
}) => {
  return (
    <>
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="margin-bottom-1">
            <h1 tabIndex={-1}>{formattedTrialSessionDetails.trialLocation}</h1>
            {formattedTrialSessionDetails.formattedTerm &&
              formattedTrialSessionDetails.sessionStatus && (
                <Tag className="text-super">
                  <span aria-hidden="true">
                    {formattedTrialSessionDetails.formattedTerm}:{' '}
                    {formattedTrialSessionDetails.sessionStatus}
                  </span>
                </Tag>
              )}
          </div>
          <p className="margin-y-0" id="case-title">
            <span>
              {formattedTrialSessionDetails.formattedStartDate}
              {formattedTrialSessionDetails.formattedEstimatedEndDate &&
                ` - ${formattedTrialSessionDetails.formattedEstimatedEndDate}`}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

TrialSessionDetailsHeader.displayName = 'TrialSessionDetailsHeader';
