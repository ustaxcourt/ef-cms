import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { ifError } from 'assert';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CheckConsolidatedCasesModal = connect(
  {
    caseDetail: state.caseDetail,
    error: state.modal.error,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  ({ caseDetail, error, modal, updateModalValueSequence }) => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-consolidated-case-search-modal"
        confirmLabel="Add to Case(s)"
        title="Would You Like To File Your Document In Multiple Cases?"
        showModalWhen="CheckConsolidatedCasesModal"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="fileDocumentToConsolidateCasesSequence"
      >
        <p className="margin-top-0">
          This case is part of a consolidated group. Please select which cases
          to file this document in.
        </p>
        <FormGroup errorText={error}>
          {caseDetail.consolidatedCases.map((consolidatedCase, index) => (
            <div className="padding-bottom-2" key={index}>
              <input
                className="usa-checkbox__input"
                id={`case-${consolidatedCase.docketNumber}`}
                name={`casesToFileDocument[${consolidatedCase.docketNumber}]`}
                type="checkbox"
                onChange={e => {
                  let casesToFileDocument;

                  casesToFileDocument = {
                    ...modal.casesToFileDocument,
                    [consolidatedCase.docketNumber]: e.target.checked,
                  };

                  if (!e.target.checked) {
                    delete casesToFileDocument[consolidatedCase.docketNumber];
                  }

                  updateModalValueSequence({
                    key: 'casesToFileDocument',
                    value: casesToFileDocument,
                  });
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`case-${consolidatedCase.docketNumber}`}
              >
                {consolidatedCase.docketNumber} {consolidatedCase.caseCaption}
              </label>
            </div>
          ))}
        </FormGroup>
      </ConfirmModal>
    );
  },
);
