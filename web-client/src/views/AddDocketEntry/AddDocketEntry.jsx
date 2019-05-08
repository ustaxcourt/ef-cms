import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SuccessNotification } from '../SuccessNotification';
import { SupportingDocumentForm } from './SupportingDocumentForm';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDocketEntry = connect(
  {
    screenMetadata: state.screenMetadata,
    submitDocketEntrySequence: sequences.submitDocketEntrySequence,
  },
  ({ submitDocketEntrySequence, screenMetadata }) => {
    return (
      <React.Fragment>
        <div className="breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section DocumentDetail">
          <CaseDetailHeader />
          <hr aria-hidden="true" />

          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0 add-bottom-margin">
            <div className="grid-row">
              <div className="grid-col-4">
                <Tabs
                  asSwitch
                  defaultActiveTab="PrimaryDocumentForm"
                  bind="wizardStep"
                >
                  <Tab tabName="PrimaryDocumentForm">
                    <PrimaryDocumentForm />
                  </Tab>
                  <Tab tabName="SupportingDocumentForm">
                    <SupportingDocumentForm />
                  </Tab>
                </Tabs>
              </div>
              <div className="grid-col-8" />
            </div>
          </div>

          <div className="button-box-container">
            <button
              id="save-and-finish"
              type="submit"
              className="usa-button"
              onClick={() => {
                submitDocketEntrySequence({
                  supportingDocument: false,
                });
              }}
            >
              Save and Finish
            </button>
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={() => {
                submitDocketEntrySequence({
                  supportingDocument: true,
                });
              }}
            >
              {screenMetadata.supporting &&
                'Save and Add Another Supporting Document'}
              {!screenMetadata.supporting &&
                'Save and Add Supporting Document(s)'}
            </button>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
