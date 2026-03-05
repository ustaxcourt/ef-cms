import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

type Props = {
  cancelSequence: Function;
  confirmSequence: Function;
};

const deps = {
  cancelSequence: sequences.dismissModalSequence,
  trialSessionStartDateChangeModalInfo:
    state.trialSessionStartDateChangeModalInfo,
};

function StartDateInformation({ startDateInfo }: { startDateInfo: string }) {
  return <>{formatDateString(startDateInfo, FORMATS.MMDDYYYY)}</>;
}

function StartDateComparison({
  headerLabel,
  startDateInfo,
}: {
  headerLabel: string;
  startDateInfo: string;
}) {
  const isCurrent = headerLabel.includes('Previous');
  return (
    <div
      className="grid-col-6 padding-right-1"
      data-testid={
        isCurrent ? 'current-start-date-info' : 'updated-start-date-info'
      }
    >
      <div className="semi-bold padding-bottom-1">{headerLabel}</div>
      <StartDateInformation startDateInfo={startDateInfo} />
    </div>
  );
}

export const ConfirmTrialSessionStartDateChangeModalDialog = connect<
  Props,
  typeof deps
>(
  deps,
  function ConfirmTrialSessionStartDateChangeModalDialog({
    cancelSequence,
    confirmSequence,
    trialSessionStartDateChangeModalInfo,
  }) {
    const { currentTrialSessionStartDate, updatedTrialSessionStartDate } =
      trialSessionStartDateChangeModalInfo;

    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Change Trial Date"
        confirmSequence={confirmSequence}
        message=""
        title="Are You Sure You Want to Change the Trial Date?"
      >
        <div className="font-sans-pro">
          <div className="grid-row padding-bottom-3">
            Changing the trial start date will automatically generate a Notice
            of Change of Trial Date.
          </div>
          <div className="grid-row padding-bottom-3">
            <StartDateComparison
              headerLabel="Previous start date"
              startDateInfo={currentTrialSessionStartDate!}
            />
            <StartDateComparison
              headerLabel="New start date"
              startDateInfo={updatedTrialSessionStartDate!}
            />
          </div>
          <div>Are you sure you want to proceed?</div>
        </div>
      </ModalDialog>
    );
  },
);
