import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state, sequences } from 'cerebral';
import React from 'react';

import { Tabs, Tab } from '../../ustc-ui/Tabs/Tabs';
import { PartyInformation } from './PartyInformation';
import { CaseInfo } from './CaseInfo';
import { IRSNotice } from './IRSNotice';
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

        <Tabs className="container-tabs">
          <Tab tabName="partyInfo" title="Parties" id="tab-parties">
            <div className="blue-container">
              <PartyInformation />
            </div>
          </Tab>
          <Tab tabName="caseInfo" title="Case Info" id="tab-case-info">
            <div className="blue-container">
              <CaseInfo />
            </div>
          </Tab>
          <Tab tabName="irsNotice" title="IRS Notice" id="tab-irs-notice">
            <div className="blue-container">
              <IRSNotice />
            </div>
          </Tab>
        </Tabs>

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
