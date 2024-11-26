import { CaseMetadataFieldset } from '@web-client/views/TrialSessionMinutes/CaseMetadataFieldset';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import { TrialSessionMetadataFieldset } from '@web-client/views/TrialSessionMinutes/SessionMetadataFieldset';
import React from 'react';
// http://localhost:1234/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc/case/101-20/minutes

export const TrialSessionMinutesForm = ({
  autosaveHandler,
  onChangeHandler,
  trialSessionMinutesFormState,
}: {
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean;
  }) => void;
  autosaveHandler: () => void;
  trialSessionMinutesFormState: MinuteSheetFormState;
}) => {
  return (
    <form>
      <TrialSessionMetadataFieldset
        trialSessionMetadataFormState={
          trialSessionMinutesFormState.trialSessionMetadata
        }
        onBlurHandler={autosaveHandler}
        onChangeHandler={onChangeHandler}
      />

      <hr />
      <CaseMetadataFieldset
        caseMetadataFormState={trialSessionMinutesFormState.caseMetadata}
        onBlurHandler={autosaveHandler}
        onChangeHandler={onChangeHandler}
      />
      <hr />
      <div>Parties Section</div>
      <hr />
      <div>Jurisdiction Retained Section</div>
      <hr />
      <div>Orders Section</div>
      <hr />
      <div>Motions Section</div>
      <hr />
      <div>Actions and Filings Section</div>
      <hr />
      <div>Trial Brief Section</div>
      <hr />
      <div>Witnesses Section</div>
      <hr />
      <div>Exhibits Section</div>
    </form>
  );
};
