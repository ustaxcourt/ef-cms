import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    form: state.form,
  },
  ({ chooseWizardStepSequence, form }) => {
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
            <label htmlFor="primary-filing">Primary Filing</label>
            {form.primaryDocumentFile.name}
          </div>

          {form.supportingDocumentFile && (
            <div className="ustc-form-group">
              <label htmlFor="supporting-documents">
                Supporting Documents for {form.documentTitle}
              </label>
              {form.supportingDocumentFile.name}
            </div>
          )}

          {form.certificateOfServiceDate && (
            <div className="ustc-form-group">
              <label htmlFor="service-date">Certificate of Service Date</label>
              {form.certificateOfServiceDate}
            </div>
          )}

          {(form.exhibits || form.attachments) && (
            <div className="ustc-form-group">
              <label htmlFor="filing-includes">Filing Includes</label>
              <ul className="ustc-unstyled-list without-margins">
                {form.exhibits && <li>Exhibit(s)</li>}
                {form.attachments && <li>Attachment(s)</li>}
              </ul>
            </div>
          )}

          <div className="ustc-form-group">
            <label htmlFor="objections">
              Are There Any Objections to This Document?
            </label>
            {form.objections}
          </div>
        </div>
      </React.Fragment>
    );
  },
);
