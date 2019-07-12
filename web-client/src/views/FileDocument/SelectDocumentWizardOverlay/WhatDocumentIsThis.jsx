import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const WhatDocumentIsThis = connect(
  {
    gotoViewDocumentCategorySequence:
      sequences.gotoViewDocumentCategorySequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  ({
    gotoViewDocumentCategorySequence,
    updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence,
    viewAllDocumentsHelper,
  }) => {
    const reasons = [
      {
        categories: [
          {
            category: 'Application',
          },
          {
            category: 'Motion',
          },
          {
            category: 'Petition',
          },
        ],
        reason: 'Request Something From the Court',
      },
      {
        categories: [
          {
            category: 'Brief',
          },
          {
            category: 'Memorandum',
          },
          {
            category: 'Notice',
          },
          {
            category: 'Statement',
          },
          {
            category: 'Stipulation',
          },
        ],
        reason: 'Notify the Court of a Change',
      },
      {
        categories: [
          {
            category: 'Miscellaneous',
          },
          {
            category: 'Supporting Documents',
          },
        ],
        reason: 'Update or Add to a Document',
      },
      {
        categories: [
          {
            category: 'Motion',
          },
          {
            category: 'Reply',
          },
          {
            category: 'Response',
          },
        ],
        reason: 'Respond to a Previous Document',
      },
    ];
    return (
      <React.Fragment>
        <div className="overlay-blue-header">
          <div className="grid-container">
            <button
              aria-roledescription="button to return to document selection"
              className="heading-3 usa-button usa-button--unstyled"
              onClick={() => updateFileDocumentWizardFormValueSequence()}
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
            <>
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
                          updateFileDocumentWizardFormValueSequence({
                            key: 'category',
                            value: category,
                          });
                          updateScreenMetadataSequence({
                            key: 'from',
                            value: 'WhatDocumentIsThis',
                          });
                          gotoViewDocumentCategoryStepSequence();
                        }}
                      >
                        {category}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}

        <div className="grid-container margin-bottom-2">
          <div className="button-box-container">
            <button
              className="usa-button"
              id="view-all-documents"
              onClick={() => gotoViewAllDocumentsStepSequence()}
            >
              View All Document Categories
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
