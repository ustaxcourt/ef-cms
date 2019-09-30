import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ViewDocumentCategory = connect(
  {
    chooseModalWizardStepSequence: sequences.chooseModalWizardStepSequence,
    clearModalSequence: sequences.clearModalSequence,
    modal: state.modal,
    overlayRef: props.overlayRef,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  ({
    chooseModalWizardStepSequence,
    clearModalSequence,
    modal,
    overlayRef,
    updateFileDocumentWizardFormValueSequence,
    viewAllDocumentsHelper,
  }) => {
    if (overlayRef && overlayRef.current) {
      overlayRef.current.scrollTo(0, 0);
    }
    return (
      <React.Fragment>
        <div className="overlay-blue-header">
          <div className="grid-container">
            <button
              aria-roledescription={`button to return to ${modal.fromLabel}`}
              className="heading-3 usa-button usa-button--unstyled"
              onClick={() =>
                chooseModalWizardStepSequence({
                  value: modal.from,
                })
              }
            >
              <FontAwesomeIcon icon="caret-left" />
              {modal.fromLabel}
            </button>
          </div>
        </div>
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <h1
                className="margin-bottom-105"
                id="view-all-document-header"
                tabIndex="-1"
              >
                {modal.category}
              </h1>
              <h2
                className="margin-bottom-205"
                id="view-all-document-subheader"
                tabIndex="-1"
              >
                Select document type
              </h2>
            </div>
          </div>
        </div>
        <div>
          {viewAllDocumentsHelper.categoryMap[modal.category].map(
            (document, index) => (
              <div
                className="category-view grid-container padding-bottom-1 padding-top-1"
                key={`document-${index}`}
              >
                <button
                  className="usa-button usa-button--unstyled"
                  onClick={() => {
                    const prefix =
                      (modal.forSecondary && 'secondaryDocument.') || '';
                    updateFileDocumentWizardFormValueSequence({
                      key: `${prefix}category`,
                      value: document.category,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${prefix}documentType`,
                      value: document.documentType,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${prefix}documentTitle`,
                      value: document.documentTitle,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${prefix}eventCode`,
                      value: document.eventCode,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${prefix}scenario`,
                      value: document.scenario,
                    });
                    clearModalSequence();
                  }}
                >
                  {document.documentType}
                </button>
              </div>
            ),
          )}
        </div>
      </React.Fragment>
    );
  },
);
