import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccessDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    form: state.form,
    requestAccessHelper: state.requestAccessHelper,
  },
  ({ chooseWizardStepSequence, form, requestAccessHelper }) => {
    return (
      <React.Fragment>
        <div>
          <h2 className="header-with-link-button">{form.documentTitle}</h2>
          <button
            className="link push-right usa-button usa-button--unstyled"
            type="button"
            onClick={() => chooseWizardStepSequence({ value: 'RequestAccess' })}
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>

        <div className="blue-container no-margin-last-child">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="primary-filing">
              {form.documentTitle}
            </label>
            <FontAwesomeIcon icon={['fas', 'file-pdf']} />
            {form.primaryDocumentFile.name}
          </div>

          {form.hasSupportingDocuments && (
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="supporting-filing">
                {form.supportingDocumentMetadata.documentTitle}
              </label>
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              {form.supportingDocumentFile.name}
            </div>
          )}

          {requestAccessHelper.showFilingIncludes && (
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="filing-includes">
                Filing Includes
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {form.certificateOfServiceDate && (
                  <li>
                    Certificate of Service{' '}
                    {requestAccessHelper.certificateOfServiceDateFormatted}
                  </li>
                )}
                {requestAccessHelper.documentWithExhibits && form.exhibits && (
                  <li>Exhibit(s)</li>
                )}
                {requestAccessHelper.documentWithAttachments &&
                  form.attachments && <li>Attachment(s)</li>}
              </ul>
            </div>
          )}

          {requestAccessHelper.showFilingNotIncludes && (
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="filing-not-includes">
                Filing Does Not Include
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {!form.certificateOfService && <li>Certificate of Service</li>}
                {requestAccessHelper.documentWithExhibits && !form.exhibits && (
                  <li>Exhibit(s)</li>
                )}
                {requestAccessHelper.documentWithAttachments &&
                  !form.attachments && <li>Attachment(s)</li>}
                {requestAccessHelper.documentWithSupportingDocuments &&
                  !form.hasSupportingDocuments && <li>Supporting Documents</li>}
              </ul>
            </div>
          )}

          {requestAccessHelper.documentWithObjections && (
            <div className="usa-form-group">
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
