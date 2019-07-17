import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PDFPreviewButton } from '../PDFPreviewButton';

export const PrimaryDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ chooseWizardStepSequence, fileDocumentHelper, form }) => {
    return (
      <React.Fragment>
        <div>
          <h2 className="header-with-link-button">
            {form.documentTitle}{' '}
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
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="primary-filing">
              {form.documentTitle}
            </label>
            <FontAwesomeIcon icon={['fas', 'file-pdf']} />
            <PDFPreviewButton
              file={form.primaryDocumentFile}
              title={form.documentTitle}
            />
          </div>

          {form.supportingDocumentFile && (
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="supporting-documents">
                {form.supportingDocumentMetadata.documentTitle}
              </label>
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              <PDFPreviewButton
                file={form.supportingDocumentFile}
                title={form.supportingDocumentMetadata.documentTitle}
              />
            </div>
          )}

          {fileDocumentHelper.showFilingIncludes && (
            <div
              className={`usa-form-group ${
                !fileDocumentHelper.showObjection ? 'margin-bottom-0' : ''
              }`}
            >
              <label className="usa-label" htmlFor="filing-includes">
                Filing Includes
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {form.certificateOfServiceDate && (
                  <li>
                    Certificate of Service{' '}
                    {fileDocumentHelper.certificateOfServiceDateFormatted}
                  </li>
                )}
                {form.exhibits && <li>Exhibit(s)</li>}
                {form.attachments && <li>Attachment(s)</li>}
              </ul>
            </div>
          )}

          {fileDocumentHelper.showFilingNotIncludes && (
            <div
              className={`usa-form-group ${
                !fileDocumentHelper.showObjection ? 'margin-bottom-0' : ''
              }`}
            >
              <label className="usa-label" htmlFor="filing-not-includes">
                Filing Does Not Include
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {!form.certificateOfService && <li>Certificate of Service</li>}
                {!form.exhibits && <li>Exhibit(s)</li>}
                {!form.attachments && <li>Attachment(s)</li>}
                {!form.hasSupportingDocuments && <li>Supporting Documents</li>}
              </ul>
            </div>
          )}

          {fileDocumentHelper.showObjection && (
            <div className="usa-form-group margin-bottom-0">
              <label className="usa-label" htmlFor="objections">
                Are There Any Objections to This Document?
              </label>
              {form.objections}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
