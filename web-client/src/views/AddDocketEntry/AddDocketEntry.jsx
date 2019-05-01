import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const AddDocketEntry = connect(
  { submitDocketEntrySequence: sequences.submitDocketEntrySequence },
  ({ submitDocketEntrySequence }) => {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid DocumentDetail">
          <CaseDetailHeader />
          <hr aria-hidden="true" />
          <h2 className="heading-1">Add Docket Entry</h2>

          <SuccessNotification />
          <ErrorNotification />

          <div className="usa-grid-full add-bottom-margin">
            <div className="usa-width-one-third">
              <PrimaryDocumentForm />
            </div>
            <div className="usa-width-two-thirds" />
          </div>

          <div className="button-box-container">
            <button
              id="save-and-finish"
              type="submit"
              className="usa-button"
              onClick={() => {
                submitDocketEntrySequence();
              }}
            >
              Save and Finish
            </button>
            <button
              type="button"
              className="usa-button-secondary"
              onClick={() => {}}
            >
              Save and Add Supporting Document(s)
            </button>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
