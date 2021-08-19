import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UnconsolidateCasesModal = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function UnconsolidateCasesModal({
    formattedCaseDetail,
    modal,
    updateModalValueSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="unconsolidated-case-search-modal"
        confirmLabel="Unconsolidate Cases"
        preventCancelOnBlur={true}
        showModalWhen="UnconsolidateCasesModal"
        title="What Cases Would You Like to Unconsolidate?"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="submitRemoveConsolidatedCasesSequence"
      >
        <FormGroup errorText={modal.error || ''}>
          <fieldset className="usa-fieldset margin-bottom-0">
            {formattedCaseDetail.consolidatedCases.map(consolidatedCase => (
              <div className="usa-checkbox" key={consolidatedCase.docketNumber}>
                <input
                  aria-describedby="representing-legend"
                  checked={
                    (modal.casesToRemove &&
                      modal.casesToRemove[consolidatedCase.docketNumber] ===
                        true) ||
                    false
                  }
                  className="usa-checkbox__input"
                  id={`case-${consolidatedCase.docketNumber}`}
                  name={`casesToRemove.${consolidatedCase.docketNumber}`}
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
                  htmlFor={`case-${consolidatedCase.docketNumber}`}
                >
                  <div className="display-inline margin-right-1">
                    {consolidatedCase.docketNumberWithSuffix}
                  </div>
                  {consolidatedCase.caseTitle}
                </label>
              </div>
            ))}
          </fieldset>
        </FormGroup>
      </ConfirmModal>
    );
  },
);
