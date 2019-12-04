import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalCaseSearchBox } from './ModalCaseSearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const NoCaseFound = () => (
  <>
    <div
      className={classNames('usa-form-group', true && 'usa-form-group--error')}
    >
      <label className="usa-label margin-bottom-0" htmlFor="case-notes">
        Case # not found
      </label>
      <p className="margin-top-0">Please try your search again.</p>
    </div>
  </>
);

export const AddConsolidatedCaseModal = connect(
  {
    caseDetail: state.modal.caseDetail,
    confirmSelection: state.modal.confirmSelection,
    error: state.modal.error,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  ({ caseDetail, confirmSelection, error, updateModalValueSequence }) => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-consolidated-case-search-modal"
        confirmLabel="Consolidate cases"
        preventCancelOnBlur={true}
        showModalWhen="AddConsolidatedCaseModal"
        title="Consolidate Cases"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="submitAddConsolidatedCaseSequence"
      >
        <ModalCaseSearchBox />

        {(caseDetail && (
          <FormGroup>
            <label className="usa-label" htmlFor="confirm-legend">
              Confirm this is the case you want to consolidate
            </label>
            <div className="usa-checkbox">
              <input
                aria-describedby="confirm-legend"
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
                {caseDetail.docketNumber} {caseDetail.caseCaption}
              </label>
            </div>
          </FormGroup>
        )) ||
          (error && <NoCaseFound />)}
      </ConfirmModal>
    );
  },
);
