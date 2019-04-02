import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

import { DocumentCategoryAccordion } from './DocumentCategoryAccordion';
import { SuccessNotification } from './SuccessNotification';
import { ErrorNotification } from './ErrorNotification';
import { SelectedDocumentType } from './FileDocument/SelectedDocumentType';
import { ChooseDocumentType } from './FileDocument/ChooseDocumentType';

class FilePetitionComponent extends React.Component {
  render() {
    const caseDetail = this.props.caseDetail;
    const form = this.props.form;
    const toggleDocumentCategoryAccordionSequence = this.props
      .toggleDocumentCategoryAccordionSequence;
    const updateFormValueSequence = this.props.updateFormValueSequence;
    const selectDocumentSequence = this.props.selectDocumentSequence;

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
              {this.props.form.isDocumentTypeSelected && (
                <SelectedDocumentType />
              )}

              {!this.props.form.isDocumentTypeSelected && (
                <ChooseDocumentType />
              )}
            </div>
            <div className="usa-width-one-third push-right">
              <div className="blue-container gray-background">
                <h3>Frequently Used Documents</h3>
                <ul className="ustc-unstyled-list">
                  <li>
                    <button
                      className="link"
                      type="button"
                      onClick={() => {
                        updateFormValueSequence({
                          key: 'category',
                          value: 'Motion',
                        });
                        updateFormValueSequence({
                          key: 'documentType',
                          value: 'Motion for Judgment on The Pleadings',
                        });
                        selectDocumentSequence();
                      }}
                    >
                      Motion for Judgment on The Pleadings
                    </button>
                  </li>
                  <li>
                    <button
                      className="link"
                      type="button"
                      onClick={() => {
                        updateFormValueSequence({
                          key: 'category',
                          value: 'Application',
                        });
                        updateFormValueSequence({
                          key: 'documentType',
                          value: 'Application for Waiver of Filing Fee',
                        });
                        selectDocumentSequence();
                      }}
                    >
                      Application for Waiver of Filing Fee
                    </button>
                  </li>
                  <li>
                    <button
                      className="link"
                      type="button"
                      onClick={() => {
                        updateFormValueSequence({
                          key: 'category',
                          value: 'Motion',
                        });
                        updateFormValueSequence({
                          key: 'documentType',
                          value: 'Motion for a New Trial',
                        });
                        selectDocumentSequence();
                      }}
                    >
                      Motion for a New Trial
                    </button>
                  </li>
                  <li>
                    <button
                      className="link"
                      type="button"
                      onClick={() => {
                        updateFormValueSequence({
                          key: 'category',
                          value: 'Motion',
                        });
                        updateFormValueSequence({
                          key: 'documentType',
                          value:
                            'Motion for Protective Order Persuant to Rule 103',
                        });
                        selectDocumentSequence();
                      }}
                    >
                      Motion for Protective Order Persuant to Rule 103
                    </button>
                  </li>
                  <li>
                    <button
                      className="link"
                      type="button"
                      onClick={() => {
                        updateFormValueSequence({
                          key: 'category',
                          value: 'Motion',
                        });
                        updateFormValueSequence({
                          key: 'documentType',
                          value: 'Motion for Continuance',
                        });
                        selectDocumentSequence();
                      }}
                    >
                      Motion for Continuance
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

FilePetitionComponent.propTypes = {
  caseDetail: PropTypes.object,
  closeDocumentCategoryAccordionSequence: PropTypes.func,
  form: PropTypes.object,
  selectDocumentSequence: PropTypes.func,
  submitting: PropTypes.bool,
  toggleDocumentCategoryAccordionSequence: PropTypes.func,
  updateFormValueSequence: PropTypes.func,
};

export const FileDocument = connect(
  {
    caseDetail: state.formattedCaseDetail,
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  FilePetitionComponent,
);
