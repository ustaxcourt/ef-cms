import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectScannerSourceModal = connect(
  {
    modal: state.modal,
    sources: state.scanHelper.sources,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  ({ modal, sources, updateModalValueSequence }) => (
    <ConfirmModal
      cancelLabel="Cancel"
      confirmLabel="Select"
      noConfirm={sources.length === 0}
      title="Select a Scanner"
      onCancelSequence="clearModalSequence"
      onConfirmSequence="selectScannerSequence"
    >
      <legend className="usa-legend" id="scanner-select-legend">
        Scanner(s) Found
      </legend>
      {sources.map((source, index) => {
        return (
          <div className="usa-radio" key={index}>
            <input
              aria-describedby="scanner-select-legend"
              aria-labelledby={`scanner-select-${index}`}
              checked={source === modal.scanner && index === modal.index}
              className="usa-radio__input"
              data-type={source}
              id={`scanner-id-${index}`}
              name="source"
              type="radio"
              value={source}
              onChange={() => {
                updateModalValueSequence({
                  key: 'scanner',
                  value: source,
                });
                updateModalValueSequence({
                  key: 'index',
                  value: index,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor={`scanner-id-${index}`}
              id={`scanner-select-${index}`}
            >
              {source}
            </label>
          </div>
        );
      })}
      {sources.length === 0 && (
        <p>There are currently no scanner sources available.</p>
      )}
    </ConfirmModal>
  ),
);
