import { DocumentCategoryAccordion } from './DocumentCategoryAccordion';
import { DocumentType } from './DocumentType';
import { DocumentTypeReadOnly } from './DocumentTypeReadOnly';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectDocumentType = connect(
  {
    form: state.form,
    screenMetadata: state.screenMetadata,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
  },
  ({
    form,
    screenMetadata,
    selectDocumentSequence,
    toggleDocumentCategoryAccordionSequence,
    updateFileDocumentWizardFormValueSequence,
  }) => {
    return (
      <React.Fragment>
        <h2 className="heading-1" id="file-a-document-header" tabIndex="-1">
          File a Document
        </h2>
        <h2>What Type of Document Are You Filing?</h2>
        <p className="margin-0">
          Choose the document category, then you’ll be able to select a document
          type.
        </p>
        <div className="usa-accordion document-category">
          <button
            aria-controls="document-category-accordion-container"
            aria-expanded={!!screenMetadata.showDocumentCategoryAccordion}
            className="usa-accordion__button document-category-accordion"
            type="button"
            onClick={() => toggleDocumentCategoryAccordionSequence()}
          >
            <span className="usa-accordion__heading usa-banner__button-text">
              <FontAwesomeIcon
                className="first-icon"
                icon="question-circle"
                size="sm"
              />
              Need help determining what document category to select?
              {screenMetadata.showDocumentCategoryAccordion ? (
                <FontAwesomeIcon icon="caret-up" />
              ) : (
                <FontAwesomeIcon icon="caret-down" />
              )}
            </span>
          </button>
          <div
            aria-hidden={!screenMetadata.showDocumentCategoryAccordion}
            className="usa-accordion__content"
            id="document-category-accordion-container"
          >
            <DocumentCategoryAccordion />
          </div>
        </div>
        <div className="blue-container">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                {!screenMetadata.isDocumentTypeSelected && <DocumentType />}

                {screenMetadata.isDocumentTypeSelected && (
                  <DocumentTypeReadOnly />
                )}
              </div>
              {!form.documentType && (
                <div className="tablet:grid-col-4 tablet:grid-offset-2 frequently-used-docs">
                  <div className="card">
                    <div className="content-wrapper">
                      <h3>Frequently Used Documents</h3>
                      <hr />
                      <ul className="ustc-unstyled-list margin-bottom-0">
                        {[
                          {
                            category: 'Motion',
                            documentType:
                              'Motion for Judgment on the Pleadings',
                          },
                          {
                            category: 'Application',
                            documentType:
                              'Application for Waiver of Filing Fee',
                          },
                          {
                            category: 'Motion',
                            documentType: 'Motion for a New Trial',
                          },
                          {
                            category: 'Motion',
                            documentType:
                              'Motion for Protective Order Pursuant to Rule 103',
                          },
                          {
                            category: 'Motion',
                            documentType: 'Motion for Continuance',
                          },
                          {
                            category: 'Notice',
                            documentType: 'Notice of No Objection',
                            scenario: 'Nonstandard A',
                          },
                          {
                            category: 'Statement',
                            documentType: 'Statement',
                            scenario: 'Nonstandard B',
                          },
                          {
                            category: 'Supporting Document',
                            documentType: 'Affidavit in Support',
                            scenario: 'Nonstandard C',
                          },
                          {
                            category: 'Miscellaneous',
                            documentType: 'Certificate of Service',
                            scenario: 'Nonstandard D',
                          },
                          {
                            category: 'Motion',
                            documentType:
                              'Motion to Change Place of Submission of Declaratory Judgment Case',
                            scenario: 'Nonstandard E',
                          },
                          {
                            category: 'Miscellaneous',
                            documentType: 'Amended',
                            scenario: 'Nonstandard F',
                          },
                          {
                            category: 'Request',
                            documentType: 'Request for Admissions',
                            scenario: 'Nonstandard G',
                          },
                          {
                            category: 'Motion',
                            documentType: 'Motion for Leave to File',
                            scenario: 'Nonstandard H',
                          },
                        ].map((document, idx) => {
                          return (
                            <li key={document.documentType}>
                              <button
                                className={`usa-button usa-button--unstyled margin-bottom-2 ${
                                  idx == 0 ? 'margin-top-0' : ''
                                }`}
                                type="button"
                                onClick={() => {
                                  updateFileDocumentWizardFormValueSequence({
                                    key: 'category',
                                    value: document.category,
                                  });
                                  updateFileDocumentWizardFormValueSequence({
                                    key: 'documentType',
                                    value: document.documentType,
                                  });
                                  selectDocumentSequence();
                                }}
                              >
                                {document.documentType}{' '}
                                {document.scenario
                                  ? `(${document.scenario})`
                                  : ''}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {screenMetadata.isDocumentTypeSelected && (
          <div className="button-box-container">
            <button
              className="usa-button"
              id="continue-button"
              type="button"
              onClick={() => {
                selectDocumentSequence();
              }}
            >
              Continue
            </button>
          </div>
        )}
      </React.Fragment>
    );
  },
);
