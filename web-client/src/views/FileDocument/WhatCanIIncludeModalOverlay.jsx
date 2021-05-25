import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { Overlay } from '../../ustc-ui/Overlay/Overlay';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const WhatCanIIncludeModalOverlay = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  function WhatCanIIncludeModalOverlay({ clearModalSequence }) {
    const content = () => (
      <React.Fragment>
        <div className="includeItem">
          <div className="includeItem__icon">
            <FontAwesomeIcon icon="check-circle" />
          </div>
          <h4 className="includeItem__heading">Include in a Single Upload</h4>
          <div className="includeItem__content">
            <h5>Attachment(s)</h5>
            <p>
              An attachment is any other item you’re submitting with your
              filing. If an attachment can’t be converted into a PDF and
              uploaded with your primary document, you can mail it to the Court.
              For more information on mailing attachments, see the{' '}
              <a
                className="usa-link--external"
                href="https://ustaxcourt.gov/resources/dawson/DAWSON_Petitioner_Training_Guide.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                Petitioner’s Guide to E-filing
              </a>
              .
            </p>
            <h5>Certificate of Service</h5>
            <p>
              If at least one party requires paper service, you must include a
              certificate of service with your document. In most cases, the only
              party you’ll need to serve is the IRS, and no certificate of
              service is required for that.
            </p>
          </div>
        </div>
        <div className="includeItem">
          <div className="includeItem__icon">
            <FontAwesomeIcon icon="times-circle" />
          </div>
          <h4 className="includeItem__heading">Include in a Separate Upload</h4>
          <div className="includeItem__content">
            <h5>Supporting Document(s)</h5>
            <p>
              A supporting document is a document that supports and/or provides
              depth to specific statements made in your primary document.
              Examples include affidavits, briefs, memorandums, and
              declarations.
              <br />
              <br />
              If you have supporting documents, you’ll upload them separately
              from your primary document.
              <br />
              <br />
              <b>
                If you have attachments and/or a certificate of service for your
                supporting document(s), you should include those as a single
                upload with the corresponding supporting document.
              </b>
            </p>
          </div>
        </div>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Mobile>
          <Overlay
            className="what-can-i-include"
            onEscSequence="clearModalSequence"
          >
            <div className="overlay-blue-header">
              <div className="grid-container">
                <Button
                  link
                  aria-roledescription="button to return to document selection"
                  className="heading-3"
                  onClick={() => clearModalSequence()}
                >
                  <FontAwesomeIcon icon="caret-left" />
                  Back to File a Document Form
                </Button>
              </div>
            </div>
            <div className="grid-container">
              <div className="grid-row">
                <h1
                  className="margin-bottom-205"
                  id="what-can-i-include-header"
                  tabIndex="-1"
                >
                  What can I include with my document?
                </h1>
                <div className="grid-col-12">{content()}</div>
              </div>
            </div>
          </Overlay>
        </Mobile>
        <NonMobile>
          <ConfirmModal
            noCancel
            className="what-can-i-include"
            confirmLabel="Close"
            title="What can I include with my document?"
            onCancelSequence="clearModalSequence"
            onConfirmSequence="clearModalSequence"
          >
            {content()}
          </ConfirmModal>
        </NonMobile>
      </React.Fragment>
    );
  },
);
