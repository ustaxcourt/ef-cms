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

        <Tabs
          className="container-tabs"
          id="case-detail-tabs"
          bind="documentDetail.tab"
        >
          <Tab tabName="partyInfo" title="Parties" id="tab-parties">
            <h3>Party Information</h3>
            <PartyInformation />
          </Tab>
          <Tab tabName="caseInfo" title="Case Info" id="tab-case-info">
            <h3>Case Information</h3>
            <CaseInfo />
          </Tab>
          <Tab tabName="irsNotice" title="IRS Notice" id="tab-irs-notice">
            <h3>IRS Notice Information</h3>
            <IRSNotice />
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
