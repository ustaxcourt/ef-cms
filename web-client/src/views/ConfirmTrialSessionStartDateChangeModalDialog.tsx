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
  return (
    <div className="tw:font-semibold">
      {formatDateString(startDateInfo, FORMATS.MMDDYYYY)}
    </div>
  );
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
      className="tw:w-50"
      data-testid={
        isCurrent ? 'current-start-date-info' : 'updated-start-date-info'
      }
    >
      <div className="tw:font-semibold tw:pb-1">{headerLabel}</div>
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
    console.log('render start date modal');
    return (
      <ModalDialog
        className="tw:mt-1"
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Change Trial Date"
        confirmSequence={confirmSequence}
        message=""
        title="Are You Sure You Want to Change the Trial Date?"
      >
        <div className="">
          <div className="tw:flex tw:pb-3">
            Changing the trial start date will automatically generate a Notice
            of Change of Trial Date.
          </div>
          <div className="tw:flex tw:flex-wrap tw:gap-4 tw:pb-3">
            <StartDateComparison
              headerLabel="Previous date"
              startDateInfo={currentTrialSessionStartDate!}
            />
            <StartDateComparison
              headerLabel="New date"
              startDateInfo={updatedTrialSessionStartDate!}
            />
          </div>
          <div>Are you sure you want to proceed?</div>
        </div>
      </ModalDialog>
    );
  },
);
