import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

import { DocumentCategoryAccordion } from './DocumentCategoryAccordion';
import { SuccessNotification } from './SuccessNotification';
import { ErrorNotification } from './ErrorNotification';
import { SelectDocumentTypeModalDialog } from './DocumentDetail/SelectDocumentTypeModalDialog';
import { SelectedDocumentType } from './FileDocument/SelectedDocumentType';
import { ChooseCategory } from './FileDocument/ChooseCategory';

class FilePetitionComponent extends React.Component {
  render() {
    const caseDetail = this.props.caseDetail;
    const constants = this.props.constants;
    const form = this.props.form;
    const showModal = this.props.showModal;
    const closeDocumentCategoryAccordionSequence = this.props
      .closeDocumentCategoryAccordionSequence;
    const openSelectDocumentTypeModalSequence = this.props
      .openSelectDocumentTypeModalSequence;
    const submitDocumentSequence = this.props.submitDocumentSequence;
    const toggleDocumentCategoryAccordionSequence = this.props
      .toggleDocumentCategoryAccordionSequence;
    const updateFormValueSequence = this.props.updateFormValueSequence;

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
              <form
                id="file-a-document"
                aria-labelledby="file-a-document-header"
                role="form"
                noValidate
                onSubmit={e => {
                  e.preventDefault();
                  submitDocumentSequence();
                }}
              >
                {this.props.form.isDocumentTypeSelected && (
                  <SelectedDocumentType />
                )}

                {!this.props.form.isDocumentTypeSelected && <ChooseCategory />}
              </form>
            </div>
            <div className="usa-width-one-third push-right">
              <div className="blue-container gray-background">
                <h3>Frequently Used Documents</h3>
                <ul className="ustc-unstyled-list">
                  <li>
                    <a href="#file-a-document-header">
                      Motion for Judgment on The Pleadings
                    </a>
                  </li>
                  <li>
                    <a href="#file-a-document-header">
                      Application for Waiver of Filing Fee
                    </a>
                  </li>
                  <li>
                    <a href="#file-a-document-header">Motion for a New Trial</a>
                  </li>
                  <li>
                    <a href="#file-a-document-header">
                      Motion for Protective Order Persuant to Rule 103
                    </a>
                  </li>
                  <li>
                    <a href="#file-a-document-header">Motion for Continuance</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {showModal === 'SelectDocumentTypeModalDialog' && (
          <SelectDocumentTypeModalDialog />
        )}
      </React.Fragment>
    );
  }
}

FilePetitionComponent.propTypes = {
  caseDetail: PropTypes.object,
  closeDocumentCategoryAccordionSequence: PropTypes.func,
  constants: PropTypes.object,
  form: PropTypes.object,
  openSelectDocumentTypeModalSequence: PropTypes.func,
  showModal: PropTypes.string,
  submitDocumentSequence: PropTypes.func,
  submitting: PropTypes.bool,
  toggleDocumentCategoryAccordionSequence: PropTypes.func,
  updateFormValueSequence: PropTypes.func,
};

export const FileDocument = connect(
  {
    caseDetail: state.formattedCaseDetail,
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    constants: state.constants,
    form: state.form,
    openSelectDocumentTypeModalSequence:
      sequences.openSelectDocumentTypeModalSequence,
    showModal: state.showModal,
    submitDocumentSequence: sequences.submitDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  FilePetitionComponent,
);
