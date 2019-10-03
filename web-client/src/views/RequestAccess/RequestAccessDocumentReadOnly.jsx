import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PDFPreviewButton } from '../PDFPreviewButton';

export const RequestAccessDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    requestAccessHelper: state.requestAccessHelper,
  },
  ({
    chooseWizardStepSequence,
    fileDocumentHelper,
    form,
    requestAccessHelper,
  }) => {
    return (
      <React.Fragment>
        <div>
          <h2 className="header-with-link-button">{form.documentTitle}</h2>
          <Button
            link
            icon="edit"
            onClick={() => chooseWizardStepSequence({ value: 'RequestAccess' })}
          >
            Edit
          </Button>
        </div>

        <div className="blue-container no-margin-last-child">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="primary-filing">
              {form.documentTitle}
            </label>
            <div className="grid-row">
              <div className="grid-col flex-auto">
                <FontAwesomeIcon
                  className="fa-icon-blue"
                  icon={['fas', 'file-pdf']}
                />
              </div>
              <div className="grid-col flex-fill">
                <PDFPreviewButton
                  file={form.primaryDocumentFile}
                  title={form.documentTitle}
                />
              </div>
            </div>
          </div>

          {form.supportingDocuments &&
            form.supportingDocuments.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
                  <div className="tablet:grid-col-6 margin-bottom-1">
                    <div className="tablet:margin-bottom-0 margin-bottom-205">
                      <label
                        className="usa-label"
                        htmlFor={`supporting-documents-${idx}`}
                      >
                        {item.documentTitle}
                      </label>
                      <div className="grid-row">
                        <div className="grid-col flex-auto">
                          <FontAwesomeIcon
                            className="fa-icon-blue"
                            icon={['fas', 'file-pdf']}
                          />
                        </div>
                        <div className="grid-col flex-fill">
                          <PDFPreviewButton
                            file={item.supportingDocumentFile}
                            title={item.documentTitle}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tablet:grid-col-6 margin-bottom-1">
                    {fileDocumentHelper.supportingDocuments[idx]
                      .showFilingIncludes && (
                      <div className="margin-bottom-0">
                        <label className="usa-label" htmlFor="filing-includes">
                          Document includes
                        </label>
                        <ul className="ustc-unstyled-list without-margins">
                          {item.certificateOfService && (
                            <li>
                              Certificate of Service{' '}
                              {
                                fileDocumentHelper.supportingDocuments[idx]
                                  .certificateOfServiceDateFormatted
                              }
                            </li>
                          )}
                          {item.attachments && <li>Attachment(s)</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}

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
                Filing does not include:
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
                Are there any objections to this document?
              </label>
              {form.objections}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
