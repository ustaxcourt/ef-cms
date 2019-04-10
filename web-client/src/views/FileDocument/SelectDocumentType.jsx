import { ChooseDocumentType } from './ChooseDocumentType';
import { DocumentCategoryAccordion } from './DocumentCategoryAccordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectedDocumentType } from './SelectedDocumentType';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectDocumentType = connect(
  {
    clearWizardDataSequence: sequences.clearWizardDataSequence,
    screenMetadata: state.screenMetadata,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    clearWizardDataSequence,
    selectDocumentSequence,
    toggleDocumentCategoryAccordionSequence,
    updateFormValueSequence,
    screenMetadata,
  }) => {
    return (
      <React.Fragment>
        <h2 tabIndex="-1" id="file-a-document-header">
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
            className="usa-accordion-button document-category-accordion"
            aria-expanded={!!screenMetadata.showDocumentCategoryAccordion}
            aria-controls="document-category-accordion-container"
            onClick={() => toggleDocumentCategoryAccordionSequence()}
          >
            <span className="usa-banner-button-text">
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
            className="usa-accordion-content"
            aria-hidden={!screenMetadata.showDocumentCategoryAccordion}
          >
            <DocumentCategoryAccordion />
          </div>
        </div>

        <div className="usa-grid-full">
          <div className="usa-width-one-half">
            {screenMetadata.isDocumentTypeSelected && <SelectedDocumentType />}

            {!screenMetadata.isDocumentTypeSelected && <ChooseDocumentType />}
          </div>
          <div className="usa-width-one-third push-right">
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
                    <li key={document.documentType}>
                      <button
                        className="link"
                        type="button"
                        onClick={() => {
                          clearWizardDataSequence({
                            key: 'documentType',
                          });
                          updateFormValueSequence({
                            key: 'category',
                            value: document.category,
                          });
                          updateFormValueSequence({
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
      </React.Fragment>
    );
  },
);
