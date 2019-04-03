import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import { DocumentCategoryAccordion } from './DocumentCategoryAccordion';
import { SuccessNotification } from './SuccessNotification';
import { ErrorNotification } from './ErrorNotification';
import { SelectedDocumentType } from './FileDocument/SelectedDocumentType';
import { ChooseDocumentType } from './FileDocument/ChooseDocumentType';

export const FileDocument = connect(
  {
    caseDetail: state.formattedCaseDetail,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    caseDetail,
    form,
    selectDocumentSequence,
    toggleDocumentCategoryAccordionSequence,
    updateFormValueSequence,
  }) => {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href={`/case-detail/${caseDetail.docketNumber}`} id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket Number: {caseDetail.docketNumberWithSuffix}
          </h1>
          <p>{caseDetail.caseTitle}</p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />

          <h2 tabIndex="-1" id="file-a-document-header">
            File a Document
          </h2>
          <h3>What Type of Document Are You Filing?</h3>
          <p>
            Choose the document category, then you’ll be able to select a
            document type.
          </p>
          <div className="usa-accordion document-category">
            <button
              type="button"
              className="usa-accordion-button document-category-accordion"
              aria-expanded={!!form.showDocumentCategoryAccordion}
              aria-controls="document-category-accordion-container"
              onClick={() => toggleDocumentCategoryAccordionSequence()}
            >
              <span className="usa-banner-button-text">
                <FontAwesomeIcon icon="question-circle" size="sm" />
                Need help determining what document category to select?
                {form.showDocumentCategoryAccordion ? (
                  <FontAwesomeIcon icon="caret-up" />
                ) : (
                  <FontAwesomeIcon icon="caret-down" />
                )}
              </span>
            </button>
            <div
              id="document-category-accordion-container"
              className="usa-accordion-content"
              aria-hidden={!form.showDocumentCategoryAccordion}
            >
              <DocumentCategoryAccordion />
            </div>
          </div>

          <div className="usa-grid-full">
            <div className="usa-width-one-half">
              {form.isDocumentTypeSelected && <SelectedDocumentType />}

              {!form.isDocumentTypeSelected && <ChooseDocumentType />}
            </div>
            <div className="usa-width-one-third push-right">
              <div className="blue-container gray-background">
                <h3>Frequently Used Documents</h3>
                <ul className="ustc-unstyled-list">
                  {[
                    {
                      category: 'Motion',
                      documentType: 'Motion for Judgment on The Pleadings',
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
                        'Motion for Protective Order Persuant to Rule 103',
                    },
                    {
                      category: 'Motion',
                      documentType: 'Motion for Continuance',
                    },
                  ].map(document => {
                    return (
                      <li key={document.documentType}>
                        <button
                          className="link"
                          type="button"
                          onClick={() => {
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
                          {document.documentType}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
