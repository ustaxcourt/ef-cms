import { FormattedMinuteSheet } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinutesSheetFormPdfAction';
import React from 'react';

export const MinutesSheet = ({
  formattedMinuteSheet,
}: {
  formattedMinuteSheet: FormattedMinuteSheet;
}) => {
  return (
    <>
      <h1>Minutes Sheet</h1>
      <p>Judge: {formattedMinuteSheet.judge}</p>
      <p>Court Reporter: {formattedMinuteSheet.courtReporter}</p>
      <p>Remote Session: {formattedMinuteSheet.remoteSession}</p>
      <p>Trial Clerk: {formattedMinuteSheet.trialClerk}</p>
    </>
  );
};
