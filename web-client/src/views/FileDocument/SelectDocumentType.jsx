import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { DocumentCategoryAccordion } from './DocumentCategoryAccordion';
import { DocumentType } from './DocumentType';
import { DocumentTypeReadOnly } from './DocumentTypeReadOnly';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectDocumentType = connect(
  {
    caseDetail: state.caseDetail,
    form: state.form,
    goToViewAllDocumentsSequence: sequences.goToViewAllDocumentsSequence,
    screenMetadata: state.screenMetadata,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
  },
  ({
    caseDetail,
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
                <div className="tablet:grid-col-4 tablet:grid-offset-2 bg-white need-help-selecting">
                  <div className="card">
                    <div className="content-header bg-accent-cool-dark text-white heading-2">
                      Need help selecting a document type?
                    </div>
                    <div className="content-wrapper">
                      <p>
                        Here are common reasons you might be filing a document.
                        Underneath each is a list of document types that are
                        usually associated with that reason.
                      </p>
                    </div>
                    <Accordion headingLevel="3">
                      <AccordionItem title="Request Something From the Court">
                        <p>Application</p>
                        <p>Motion</p>
                        <p>Petition</p>
                      </AccordionItem>
                      <AccordionItem title="Notify the Court of a Change">
                        <p>Brief</p>
                        <p>Memorandum</p>
                        <p>Notice</p>
                        <p>Statement</p>
                        <p>Stipulation</p>
                      </AccordionItem>
                      <AccordionItem title="Update or Add to a Document">
                        <p>Miscellaneous</p>
                        <p>Supporting Documents</p>
                      </AccordionItem>
                      <AccordionItem title="Respond to a Previous Document">
                        <p>Motion</p>
                        <p>Reply</p>
                        <p>Response</p>
                      </AccordionItem>
                    </Accordion>
                    <div className="content-wrapper">
                      <div>
                        <a
                          className="usa-button usa-button--outline"
                          href={`/case-detail/${caseDetail.docketNumber}/file-a-document/view-all-documents`}
                          id="view-all-documents"
                        >
                          View All Document Categories
                        </a>
                      </div>
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
