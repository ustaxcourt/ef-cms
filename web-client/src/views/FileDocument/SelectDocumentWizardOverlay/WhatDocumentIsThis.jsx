import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const WhatDocumentIsThis = connect(
  {
    chooseModalWizardStepSequence: sequences.chooseModalWizardStepSequence,
    clearModalSequence: sequences.clearModalSequence,
    overlayRef: props.overlayRef,
    reasons: state.viewAllDocumentsHelper.reasons,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  ({
    chooseModalWizardStepSequence,
    clearModalSequence,
    overlayRef,
    reasons,
    updateModalValueSequence,
  }) => {
    if (overlayRef && overlayRef.current) {
      overlayRef.current.scrollTo(0, 0);
    }
    return (
      <React.Fragment>
        <div className="overlay-blue-header">
          <div className="grid-container">
            <button
              aria-roledescription="button to return to document selection"
              className="heading-3 usa-button usa-button--unstyled"
              onClick={() => clearModalSequence()}
            >
              <FontAwesomeIcon icon="caret-left" />
              What document are you filing?
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
                What is this document for?
              </h1>
              <p className="margin-bottom-0">
                Here are common reasons you might be filing a document.
                Underneath each is a list of document types that are usually
                associated with that reason.
              </p>
            </div>
          </div>
        </div>

        {reasons.map(({ categories, reason }, reasonIndex) => {
          return (
            <React.Fragment key={`reason-${reasonIndex}`}>
              <div className="grid-container">
                <div className="grid-row">
                  <div className="grid-col-12">
                    <h2 className="margin-top-4 margin-bottom-3" tabIndex="-1">
                      {reason}
                    </h2>
                  </div>
                </div>
              </div>
              <div>
                {categories.map(({ category }, categoryIndex) => {
                  return (
                    <div
                      className="category-view grid-container padding-bottom-1 padding-top-1"
                      key={`${reasonIndex}-${categoryIndex}`}
                    >
                      <button
                        className="usa-button usa-button--unstyled "
                        onClick={() => {
                          updateModalValueSequence({
                            key: 'category',
                            value: category,
                          });
                          updateModalValueSequence({
                            key: 'from',
                            value: 'WhatDocumentIsThis',
                          });
                          updateModalValueSequence({
                            key: 'fromLabel',
                            value: 'What is this document for?',
                          });
                          chooseModalWizardStepSequence({
                            value: 'ViewDocumentCategory',
                          });
                        }}
                      >
                        {category}
                      </button>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}

        <div className="grid-container margin-bottom-2">
          <div className="button-box-container">
            <button
              className="usa-button"
              id="view-all-documents"
              onClick={() =>
                chooseModalWizardStepSequence({
                  value: 'ViewAllDocuments',
                })
              }
            >
              View All Document Categories
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
