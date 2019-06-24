import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { sequences, state } from 'cerebral';

import { CaseInfo } from './CaseInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRSNotice } from './IRSNotice';
import { PartyInformation } from './PartyInformation';
import { connect } from '@cerebral/react';
import React from 'react';

export const CaseDetailEdit = connect(
  {
    screenMetadata: state.screenMetadata,
    submitCaseDetailEditSaveSequence:
      sequences.submitCaseDetailEditSaveSequence,
    submitting: state.submitting,
    unsetFormSaveSuccessSequence: sequences.unsetFormSaveSuccessSequence,
  },
  ({
    screenMetadata,
    submitCaseDetailEditSaveSequence,
    submitting,
    unsetFormSaveSuccessSequence,
  }) => {
    return (
      <form
        noValidate
        id="case-edit-form"
        role="form"
        onFocus={() => {
          unsetFormSaveSuccessSequence();
        }}
        onSubmit={e => {
          e.preventDefault();
          submitCaseDetailEditSaveSequence();
        }}
      >
        <Tabs
          boxed
          bind="documentDetail.tab"
          className="container-tabs tab-button-h3"
          id="case-detail-tabs"
        >
          <Tab id="tab-parties" tabName="partyInfo" title="Parties">
            <PartyInformation />
          </Tab>
          <Tab id="tab-case-info" tabName="caseInfo" title="Case Info">
            <CaseInfo />
          </Tab>
          <Tab id="tab-irs-notice" tabName="irsNotice" title="IRS Notice">
            <IRSNotice />
          </Tab>
        </Tabs>

        <button
          aria-disabled={submitting ? 'true' : 'false'}
          className={
            submitting
              ? 'usa-button usa-button-active'
              : 'usa-button usa-button--outline'
          }
          disabled={submitting}
          type="submit"
        >
          {submitting && <div className="spinner" />}
          Save
        </button>
        {screenMetadata.showSaveSuccess && (
          <span aria-live="polite" className="mini-success" role="alert">
            <FontAwesomeIcon icon="check-circle" size="sm" />
            Your changes have been saved.
          </span>
        )}
      </form>
    );
  },
);
