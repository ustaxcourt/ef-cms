import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ViewAllDocumentsMobile = connect(
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
    return (
      <React.Fragment>
        <button
          aria-roledescription="button to return to docket record"
          className="heading-2 usa-button usa-button--unstyled"
          onClick={() => closeFunc()}
        >
          <FontAwesomeIcon icon="caret-left" />
          Document Details
        </button>
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <h1
                className="margin-bottom-105"
                id="view-all-document-header"
                tabIndex="-1"
              >
                All Document Categories
              </h1>
              <h2
                className="margin-bottom-205"
                id="view-all-document-header"
                tabIndex="-1"
              >
                Select Document Category
              </h2>
            </div>
          </div>
        </div>
        <div>
          {viewAllDocumentsHelper.sections.map((title, index) => {
            return (
              <div
                className="category-view grid-container padding-bottom-1 padding-top-1"
                key={`${title}-document-${index}`}
              >
                <button
                  className="usa-button usa-button--unstyled "
                  onClick={() => {
                    updateFileDocumentWizardFormValueSequence({
                      key: 'category',
                      value: title,
                    });
                    updateScreenMetadataSequence({
                      key: 'from',
                      value: 'ViewAllDocuments',
                    });
                    gotoViewDocumentCategorySequence();
                  }}
                >
                  {title}
                </button>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  },
);
