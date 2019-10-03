import { Button } from '../../ustc-ui/Button/Button';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccessReview = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    navigateBackSequence: sequences.navigateBackSequence,
    requestAccessHelper: state.requestAccessHelper,
    showModal: state.showModal,
    submitCaseAssociationRequestSequence:
      sequences.submitCaseAssociationRequestSequence,
  },
  ({
    fileDocumentHelper,
    form,
    formattedCaseDetail,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    requestAccessHelper,
    showModal,
    submitCaseAssociationRequestSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h1 className="heading-1" id="file-a-document-header" tabIndex="-1">
            Review Your Filing
          </h1>
        </Focus>

        <p className="full-width">
          You can’t edit your filing once you submit it. Please make sure your
          information appears the way you want it to.
        </p>

        <Hint>
          Don’t forget to check your PDF(s) to ensure all personal information
          has been removed or redacted.
        </Hint>

        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-7 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Your Document(s)</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
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
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      {requestAccessHelper.showFilingIncludes && (
                        <div
                          className={` ${
                            !requestAccessHelper.documentWithObjections
                              ? 'margin-bottom-0'
                              : 'margin-bottom-5'
                          }`}
                        >
                          <label
                            className="usa-label"
                            htmlFor="filing-includes"
                          >
                            Document includes
                          </label>
                          <ul className="ustc-unstyled-list without-margins">
                            {form.certificateOfService && (
                              <li>
                                Certificate of Service{' '}
                                {
                                  requestAccessHelper.certificateOfServiceDateFormatted
                                }
                              </li>
                            )}
                            {form.attachments && <li>Attachment(s)</li>}
                          </ul>
                        </div>
                      )}

                      {requestAccessHelper.documentWithObjections && (
                        <div className="margin-bottom-0">
                          <label className="usa-label" htmlFor="objections">
                            Objections?
                          </label>
                          {form.objections}
                        </div>
                      )}
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
                                <label
                                  className="usa-label"
                                  htmlFor="filing-includes"
                                >
                                  Document includes
                                </label>
                                <ul className="ustc-unstyled-list without-margins">
                                  {item.certificateOfService && (
                                    <li>
                                      Certificate of Service{' '}
                                      {
                                        fileDocumentHelper.supportingDocuments[
                                          idx
                                        ].certificateOfServiceDateFormatted
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
                </div>
              </div>
            </div>

            {requestAccessHelper.showPartiesRepresenting && (
              <div className="tablet:grid-col-5 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined">Parties You’re Representing</h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        <label className="usa-label" htmlFor="filing-parties">
                          Parties
                        </label>
                        <ul className="ustc-unstyled-list without-margins">
                          {form.representingPrimary && (
                            <li>
                              {formattedCaseDetail.contactPrimary.name},
                              Petitioner
                            </li>
                          )}
                          {form.representingSecondary && (
                            <li>
                              {formattedCaseDetail.contactSecondary.name},
                              Petitioner
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid-row grid-gap margin-bottom-5">
          <div className="tablet:grid-col-12 bg-white submit-reminders">
            <div className="card">
              <div className="content-header bg-accent-cool-dark text-white heading-3">
                A Few Reminders Before You Submit
              </div>
              <div className="content-wrapper">
                <p>
                  1. Double check that the PDF files you’ve selected are
                  correct. <br />
                  2. Be sure you’ve removed or redacted all personal information
                  from your documents. <br />
                  3. Indicate any related documents that you’ve included with
                  your filing. <br />
                  4. Confirm everything appears as you want it to—you can’t edit
                  your filing after you submit it.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          id="submit-document"
          type="submit"
          onClick={() => {
            submitCaseAssociationRequestSequence();
          }}
        >
          Submit Your Filing
        </Button>
        <Button secondary onClick={() => navigateBackSequence()}>
          Back
        </Button>
        <Button
          link
          onClick={() => {
            formCancelToggleCancelSequence();
          }}
        >
          Cancel
        </Button>

        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={submitCaseAssociationRequestSequence}
          />
        )}
      </React.Fragment>
    );
  },
);
