import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PDFPreviewButton } from '../PDFPreviewButton';

export const SecondaryDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ chooseWizardStepSequence, fileDocumentHelper, form }) => {
    return (
      <React.Fragment>
        <div>
          <h2 className="header-with-link-button margin-top-4">
            {form.secondaryDocument.documentTitle}{' '}
            <button
              className="usa-button usa-button--unstyled margin-left-205"
              type="button"
              onClick={() =>
                chooseWizardStepSequence({ value: 'FileDocument' })
              }
            >
              <FontAwesomeIcon icon="edit" size="sm" />
              Edit
            </button>
          </h2>
        </div>

        <div className="blue-container">
          {form.secondaryDocumentFile && (
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="secondary-filing">
                {form.secondaryDocument.documentTitle}
              </label>
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              <PDFPreviewButton
                file={form.secondaryDocumentFile}
                title={form.secondaryDocument.documentTitle}
              />
            </div>
          )}

          {form.secondarySupportingDocumentFile && (
            <div className="usa-form-group">
              <label
                className="usa-label"
                htmlFor="secondary-supporting-documents"
              >
                {form.secondarySupportingDocumentMetadata.documentTitle}
              </label>
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              <PDFPreviewButton
                file={form.secondarySupportingDocumentFile}
                title={form.secondarySupportingDocumentMetadata.documentTitle}
              />
            </div>
          )}

          {!form.secondaryDocumentFile &&
            !form.secondarySupportingDocumentFile &&
            'No file attached'}

          {fileDocumentHelper.showSecondaryFilingNotIncludes && (
            <div className="usa-form-group margin-bottom-0">
              <label className="usa-label" htmlFor="filing-not-includes">
                Filing Does Not Include
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {!form.hasSecondarySupportingDocuments && (
                  <li>Supporting Documents</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
