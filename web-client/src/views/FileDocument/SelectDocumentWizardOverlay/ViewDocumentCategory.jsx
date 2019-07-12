import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ViewDocumentCategory = connect(
  {
    chooseModalWizardStepSequence: sequences.chooseModalWizardStepSequence,
    clearModalSequence: sequences.clearModalSequence,
    modal: state.modal,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  ({
    chooseModalWizardStepSequence,
    clearModalSequence,
    modal,
    updateFileDocumentWizardFormValueSequence,
    viewAllDocumentsHelper,
  }) => {
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
                id="view-all-document-header"
                tabIndex="-1"
              >
                Select Document Type
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
                    updateFileDocumentWizardFormValueSequence({
                      key: `${(modal.forSecondary && 'secondaryDocument.') ||
                        ''}category`,
                      value: document.category,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${(modal.forSecondary && 'secondaryDocument.') ||
                        ''}documentType`,
                      value: document.documentType,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${(modal.forSecondary && 'secondaryDocument.') ||
                        ''}documentTitle`,
                      value: document.documentTitle,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${(modal.forSecondary && 'secondaryDocument.') ||
                        ''}eventCode`,
                      value: document.eventCode,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: `${(modal.forSecondary && 'secondaryDocument.') ||
                        ''}scenario`,
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
