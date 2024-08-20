import { CardHeader } from './CardHeader';
import React from 'react';

export function CaseInformation({ petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader step={4} title="Case Procedure and Trial Location" />
        <div className="petition-review-case-information-section">
          <div className="line-height-2">
            <div className="margin-bottom-1 semi-bold">Case procedure</div>
            <div data-testid="procedure-type">
              {petitionFormatted.procedureType}
            </div>
          </div>
          <div className="line-height-2 petition-review-spacing">
            <div className="margin-bottom-1 semi-bold">
              Requested trial location
            </div>
            <div className="margin-bottom-1" data-testid="trial-location">
              {petitionFormatted.preferredTrialCity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
