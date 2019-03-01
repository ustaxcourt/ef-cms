import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state, sequences } from 'cerebral';
import React from 'react';

import { CaseDetailEditPartyInformation } from './CaseDetailEdit/CaseDetailEditPartyInformation';
import { CaseInfo } from './CaseDetailEdit/CaseInfo';
import { IRSNotice } from './CaseDetailEdit/IRSNotice';
import { UpdateCaseCancelModalDialog } from './UpdateCaseCancelModalDialog';

export const CaseDetailEdit = connect(
  {
    form: state.form,
    showModal: state.showModal,
    submitCaseDetailEditSaveSequence:
      sequences.submitCaseDetailEditSaveSequence,
    submitting: state.submitting,
    unsetFormSaveSuccessSequence: sequences.unsetFormSaveSuccessSequence,
  },
  ({
    form,
    showModal,
    submitCaseDetailEditSaveSequence,
    submitting,
    unsetFormSaveSuccessSequence,
  }) => {
    return (
      <form
        id="case-edit-form"
        noValidate
        onSubmit={e => {
          e.preventDefault();
          submitCaseDetailEditSaveSequence();
        }}
        role="form"
        onFocus={() => {
          unsetFormSaveSuccessSequence();
        }}
      >
        {showModal === 'UpdateCaseCancelModalDialog' && (
          <UpdateCaseCancelModalDialog />
        )}

        <CaseDetailEditPartyInformation />

        <div className="blue-container">
          <IRSNotice />
        </div>

        <div className="blue-container">
          <CaseInfo />
        </div>

        <button
          aria-disabled={submitting ? 'true' : 'false'}
          className={
            submitting ? 'usa-button-active' : 'usa-button usa-button-secondary'
          }
          disabled={submitting}
          type="submit"
        >
          {submitting && <div className="spinner" />}
          Save
        </button>
        {form.showSaveSuccess && (
          <span className="mini-success">
            <FontAwesomeIcon icon="check-circle" size="sm" />
            Your changes have been saved.
          </span>
        )}
      </form>
    );
  },
);
