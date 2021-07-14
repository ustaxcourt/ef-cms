import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CheckConsolidatedCasesModal = connect(
  {
    error: state.modal.error,
    formattedCaseDetail: state.formattedCaseDetail,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function CheckConsolidatedCasesModal({
    error,
    formattedCaseDetail,
    modal,
    updateModalValueSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-consolidated-case-search-modal"
        confirmLabel="Add to Case(s)"
        title="Would You Like To File Your Document In Multiple Cases?"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="setSelectedCasesForConsolidatedCaseDocumentSubmissionSequence"
      >
        <p className="margin-top-0">
          This case is part of a consolidated group. Please select which cases
          to file this document in.
        </p>
        <FormGroup errorText={error}>
          {formattedCaseDetail.consolidatedCases.map(
            formattedConsolidatedCase => (
              <div
                className="padding-bottom-2"
                key={formattedConsolidatedCase.docketNumber}
              >
                <input
                  className="usa-checkbox__input"
                  id={`case-${formattedConsolidatedCase.docketNumber}`}
                  name={`casesToFileDocument[${formattedConsolidatedCase.docketNumber}]`}
                  type="checkbox"
                  onChange={e => {
                    let casesToFileDocument;

                    casesToFileDocument = {
                      ...modal.casesToFileDocument,
                      [formattedConsolidatedCase.docketNumber]:
                        e.target.checked,
                    };

                    if (!e.target.checked) {
                      delete casesToFileDocument[
                        formattedConsolidatedCase.docketNumber
                      ];
                    }

                    updateModalValueSequence({
                      key: 'casesToFileDocument',
                      value: casesToFileDocument,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor={`case-${formattedConsolidatedCase.docketNumber}`}
                >
                  {formattedConsolidatedCase.docketNumber}{' '}
                  {formattedConsolidatedCase.caseTitle}
                </label>
              </div>
            ),
          )}
        </FormGroup>
      </ConfirmModal>
    );
  },
);
