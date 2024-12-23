import { FormattedMinuteSheet } from '@web-api/business/useCases/trialSessionMinutes/generateTrialSessionMinutesPdfInteractor';
import { MinuteSheetHeader } from '../components/MinuteSheetHeader';
import React from 'react';

export const MinuteSheet = ({
  formattedMinuteSheet,
}: {
  formattedMinuteSheet: FormattedMinuteSheet;
}) => {
  return (
    <>
      <MinuteSheetHeader
        trialSessionLocation={formattedMinuteSheet.trialLocation}
        trialStartDate={formattedMinuteSheet.trialStartDate}
      />
      <h1>Minutes of Preceedings</h1>
      <p>Judge: {formattedMinuteSheet.judge}</p>
      <p>Court Reporter: {formattedMinuteSheet.courtReporter}</p>
      <p>Remote Session: {formattedMinuteSheet.remoteSession}</p>
      <p>Trial Clerk: {formattedMinuteSheet.trialClerk}</p>
    </>
  );
};
