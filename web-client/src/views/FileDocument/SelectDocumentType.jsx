import { DocumentCategoryAccordion } from './DocumentCategoryAccordion';
import { DocumentType } from './DocumentType';
import { DocumentTypeReadOnly } from './DocumentTypeReadOnly';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectDocumentType = connect(
  {
    screenMetadata: state.screenMetadata,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
  },
  ({
    selectDocumentSequence,
    toggleDocumentCategoryAccordionSequence,
    updateFileDocumentWizardFormValueSequence,
    screenMetadata,
  }) => {
    return (
      <React.Fragment>
        <h2 className="heading-1" tabIndex="-1" id="file-a-document-header">
          File a Document
        </h2>
        <h3>What Type of Document Are You Filing?</h3>
        <p>
          Choose the document category, then you’ll be able to select a document
          type.
        </p>
        <div className="usa-accordion document-category">
          <button
            type="button"
            className="usa-accordion__button document-category-accordion"
            aria-expanded={!!screenMetadata.showDocumentCategoryAccordion}
            aria-controls="document-category-accordion-container"
            onClick={() => toggleDocumentCategoryAccordionSequence()}
          >
            <span className="usa-accordion__heading usa-banner__button-text">
              <FontAwesomeIcon icon="question-circle" size="sm" />
              Need help determining what document category to select?
              {screenMetadata.showDocumentCategoryAccordion ? (
                <FontAwesomeIcon icon="caret-up" />
              ) : (
                <FontAwesomeIcon icon="caret-down" />
              )}
            </span>
          </button>
          <div
            id="document-category-accordion-container"
            className="usa-accordion__content"
            aria-hidden={!screenMetadata.showDocumentCategoryAccordion}
          >
            <DocumentCategoryAccordion />
          </div>
        </div>

        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              {!screenMetadata.isDocumentTypeSelected && <DocumentType />}

              {screenMetadata.isDocumentTypeSelected && (
                <DocumentTypeReadOnly />
              )}
            </div>
            <div className="tablet:grid-col-4 tablet:grid-offset-2">
              <div className="blue-container gray-background">
                <h3>Frequently Used Documents</h3>
                <ul className="ustc-unstyled-list">
                  {[
                    {
                      category: 'Motion',
                      documentType: 'Motion for Judgment on the Pleadings',
                    },
                    {
                      category: 'Application',
                      documentType: 'Application for Waiver of Filing Fee',
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
                  ].map(document => {
                    return (
                      <li
                        key={document.documentType}
                        className="margin-bottom-2"
                      >
                        <button
                          className="usa-button usa-button--unstyled"
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
                          {document.scenario ? `(${document.scenario})` : ''}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
