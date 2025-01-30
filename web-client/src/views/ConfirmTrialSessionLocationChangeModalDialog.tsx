import { ModalDialog } from './ModalDialog';
import { TrialSessionLocationInfo } from '@shared/business/entities/trialSessions/TrialSession';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type Props = {
  cancelSequence: Function;
  confirmSequence: Function;
};

const deps = {
  cancelSequence: sequences.dismissModalSequence,
  trialSessionLocationChangeModalInfo:
    state.trialSessionLocationChangeModalInfo,
};

function TrialLocationInformation({
  locationInfo,
}: {
  locationInfo: TrialSessionLocationInfo;
}) {
  const LOCATION_INFO: (keyof TrialSessionLocationInfo)[] = [
    'trialLocation',
    'courthouseName',
    'address1',
    'address2',
    'city',
    'state',
    'postalCode',
  ];

  return (
    <>
      {LOCATION_INFO.filter(prop => Boolean(locationInfo[prop])).map(prop => (
        <div key={prop}>{locationInfo[prop]}</div>
      ))}
    </>
  );
}

function TrialLocationComparison({
  headerLabel,
  locationInfo,
}: {
  headerLabel: string;
  locationInfo: TrialSessionLocationInfo;
}) {
  const isCurrent = headerLabel.includes('Previous');
  return (
    <div
      className="grid-col-6 padding-right-1"
      data-testid={
        isCurrent ? 'current-location-info' : 'updated-location-info'
      }
    >
      <div className="semi-bold padding-bottom-1">{headerLabel}</div>
      <TrialLocationInformation locationInfo={locationInfo} />
    </div>
  );
}

export const ConfirmTrialSessionLocationChangeModalDialog = connect<
  Props,
  typeof deps
>(
  deps,
  function ConfirmTrialSessionLocationChangeModalDialog({
    cancelSequence,
    confirmSequence,
    trialSessionLocationChangeModalInfo,
  }) {
    const { currentTrialSessionLocation, updatedTrialSessionLocation } =
      trialSessionLocationChangeModalInfo;

    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Change Trial Location"
        confirmSequence={confirmSequence}
        message=""
        title="Are You Sure You Want to Change the Trial Location?"
      >
        <div className="font-sans-pro">
          <div className="grid-row padding-bottom-3">
            Changing the trial location will automatically generate a Notice of
            Change of Trial Location.
          </div>
          <div className="grid-row padding-bottom-3">
            <TrialLocationComparison
              headerLabel="Previous location"
              locationInfo={currentTrialSessionLocation!}
            />
            <TrialLocationComparison
              headerLabel="New location"
              locationInfo={updatedTrialSessionLocation!}
            />
          </div>
          <div>Are you sure you want to proceed?</div>
        </div>
      </ModalDialog>
    );
  },
);
