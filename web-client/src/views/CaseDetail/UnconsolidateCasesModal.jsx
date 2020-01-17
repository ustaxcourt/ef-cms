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
    validateSequence: sequences.validateAddRespondentSequence,
  },
  ({
    formattedCaseDetail,
    modal,
    updateModalValueSequence,
    validateSequence,
  }) => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="unconsolidated-case-search-modal"
        confirmLabel="Unconsolidate Cases"
        preventCancelOnBlur={true}
        showModalWhen="UnconsolidateCasesModal"
        title="What Cases Would You Like to Unconsolidate?"
        onCancelSequence="clearModalSequence"
        // onConfirmSequence="submitAddConsolidatedCaseSequence"
      >
        <FormGroup>
          <fieldset className="usa-fieldset margin-bottom-0">
            {formattedCaseDetail.consolidatedCases.map(
              (consolidatedCase, index) => (
                <div className="usa-checkbox" key={index}>
                  <input
                    aria-describedby="representing-legend"
                    checked={modal[consolidatedCase.caseId] === true}
                    className="usa-checkbox__input"
                    id={`case-${consolidatedCase.caseId}`}
                    name={consolidatedCase.caseId}
                    type="checkbox"
                    onChange={e => {
                      updateModalValueSequence({
                        key: consolidatedCase.caseId,
                        value: e.target.checked,
                      });
                      validateSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor={`case-${consolidatedCase.caseId}`}
                  >
                    {consolidatedCase.docketNumberWithSuffix}{' '}
                    {consolidatedCase.caseName}
                  </label>
                </div>
              ),
            )}
          </fieldset>
        </FormGroup>
      </ConfirmModal>
    );
  },
);
