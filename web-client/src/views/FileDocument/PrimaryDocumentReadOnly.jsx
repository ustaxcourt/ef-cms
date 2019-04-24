import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ chooseWizardStepSequence, form, fileDocumentHelper }) => {
    return (
      <React.Fragment>
        <div>
          <h3 className="header-with-link-button">{form.documentTitle}</h3>
          <button
            className="link push-right"
            type="button"
            onClick={() => chooseWizardStepSequence({ value: 'FileDocument' })}
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>

        <div className="blue-container">
          <div className="ustc-form-group">
            <label htmlFor="primary-filing">{form.documentTitle}</label>
            <FontAwesomeIcon icon={['fas', 'file-pdf']} />
            {form.primaryDocumentFile.name}
          </div>

          {form.supportingDocumentFile && (
            <div className="ustc-form-group">
              <label htmlFor="supporting-documents">
                {form.supportingDocumentMetadata.documentTitle}
              </label>
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              {form.supportingDocumentFile.name}
            </div>
          )}

          {fileDocumentHelper.showFilingIncludes && (
            <div className="ustc-form-group">
              <label htmlFor="filing-includes">Filing Includes</label>
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
            <div className="ustc-form-group">
              <label htmlFor="filing-not-includes">
                Filing Does Not Include
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {!form.certificateOfService && <li>Certificate of Service</li>}
                {!form.exhibits && <li>Exhibit(s)</li>}
                {!form.attachments && <li>Attachment(s)</li>}
              </ul>
            </div>
          )}

          {fileDocumentHelper.showObjection && (
            <div className="ustc-form-group">
              <label htmlFor="objections">
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
