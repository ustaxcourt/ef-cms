import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SelectScannerSourceModal = connect(
  {
    modal: state.modal,
    scanModeOptions: state.scanHelper.scanModeOptions,
    sources: state.scanHelper.sources,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function SelectScannerSourceModal({
    modal,
    scanModeOptions,
    sources,
    updateModalValueSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Select"
        noConfirm={sources.length === 0}
        title="Select a Scanner"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="selectScannerSequence"
      >
        <div className="usa-form-group margin-top-1">
          <legend className="usa-legend" id="scanner-select">
            What scanner are you using?
          </legend>
          <select
            className="usa-select"
            defaultValue={modal.scanner}
            id="scanner-select"
            onChange={e => {
              updateModalValueSequence({
                key: 'scanner',
                value: e.target.value,
              });
              updateModalValueSequence({
                key: 'index',
                value: e.target.selectedIndex,
              });
            }}
          >
            {sources.map((source, index) => {
              return (
                <option
                  data-index={index}
                  id={`scanner-id-${index}`}
                  key={source}
                  value={source}
                >
                  {source}
                </option>
              );
            })}
          </select>
        </div>
        <div className="usa-form-group margin-top-4">
          <label className="usa-label" htmlFor="scanner-duplex-select">
            How would you like to scan your documents?
          </label>

          <select
            className="usa-select"
            defaultValue={modal.scanMode}
            id="scanner-duplex-select"
            onChange={e => {
              updateModalValueSequence({
                key: 'scanMode',
                value: e.target.value,
              });
            }}
          >
            {scanModeOptions.map(scanMode => {
              return (
                <option key={scanMode.value} value={scanMode.value}>
                  - {scanMode.label} -
                </option>
              );
            })}
          </select>
        </div>
        {sources.length === 0 && (
          <p>There are currently no scanner sources available.</p>
        )}
      </ConfirmModal>
    );
  },
);

SelectScannerSourceModal.displayName = 'SelectScannerSourceModal';
