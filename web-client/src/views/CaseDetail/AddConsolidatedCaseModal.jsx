import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalCaseSearchBox } from './ModalCaseSearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const NoCaseFound = () => (
  <div className="usa-form-group">
    <label
      className="usa-label margin-bottom-0 text-secondary-dark"
      htmlFor="validation-message"
    >
      No results found
    </label>
    <p className="margin-top-0" id="validation-message">
      Please try your search again.
    </p>
  </div>
);

export const AddConsolidatedCaseModal = connect(
  {
    caseDetail: state.modal.caseDetail,
    confirmSelection: state.modal.confirmSelection,
    error: state.modal.error,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function AddConsolidatedCaseModal({
    caseDetail,
    confirmSelection,
    error,
    updateModalValueSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-consolidated-case-search-modal"
        confirmLabel="Consolidate Cases"
        preventCancelOnBlur={true}
        showModalWhen="AddConsolidatedCaseModal"
        title="Consolidate Cases"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="submitAddConsolidatedCaseSequence"
      >
        <ModalCaseSearchBox />

        {(caseDetail && (
          <FormGroup errorText={error}>
            <legend className="usa-legend" id="confirm-selection-legend">
              Confirm this is the case you want to consolidate
            </legend>
            <div className="usa-checkbox" id="confirm-legend">
              <input
                aria-describedby="confirm-selection-legend"
                checked={confirmSelection || false}
                className="usa-checkbox__input"
                id="confirm-selection"
                name="confirmSelection"
                type="checkbox"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="confirm-selection"
              >
                {caseDetail.docketNumber}
                {caseDetail.docketNumberSuffix} {caseDetail.caseCaption}
              </label>
            </div>
          </FormGroup>
        )) ||
          (error && <NoCaseFound />)}
      </ConfirmModal>
    );
  },
);
