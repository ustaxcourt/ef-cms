import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { PDFPreviewModal } from '../PDFPreviewModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocumentReviewRedesign = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
    showModal: state.showModal,
    submitExternalDocumentSequence: sequences.submitExternalDocumentSequence,
  },
  ({
    caseDetail,
    chooseWizardStepSequence,
    fileDocumentHelper,
    form,
    formCancelToggleCancelSequence,
    openPdfPreviewModalSequence,
    showModal,
    submitExternalDocumentSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h1 className="heading-1" id="file-a-document-header" tabIndex="-1">
            Review Your Filing
          </h1>
        </Focus>

        <p>
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
                      <div className="margin-bottom-1">
                        <label className="usa-label" htmlFor="primary-filing">
                          {form.documentTitle}
                        </label>
                        <FontAwesomeIcon icon={['fas', 'file-pdf']} />
                        <PDFPreviewButton file={form.primaryDocumentFile} />
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      {fileDocumentHelper.showFilingIncludes && (
                        <div
                          className={` ${
                            !fileDocumentHelper.showObjection
                              ? 'margin-bottom-0'
                              : ''
                          }`}
                        >
                          <label
                            className="usa-label"
                            htmlFor="filing-includes"
                          >
                            Filing Includes
                          </label>
                          <ul className="ustc-unstyled-list without-margins">
                            {form.certificateOfServiceDate && (
                              <li>
                                Certificate of Service{' '}
                                {
                                  fileDocumentHelper.certificateOfServiceDateFormatted
                                }
                              </li>
                            )}
                            {form.exhibits && <li>Exhibit(s)</li>}
                            {form.attachments && <li>Attachment(s)</li>}
                          </ul>
                        </div>
                      )}

                      {fileDocumentHelper.showFilingNotIncludes && (
                        <div
                          className={`${
                            !fileDocumentHelper.showObjection
                              ? 'margin-bottom-0'
                              : ''
                          }`}
                        >
                          <label
                            className="usa-label"
                            htmlFor="filing-not-includes"
                          >
                            Filing Does Not Include
                          </label>
                          <ul className="ustc-unstyled-list without-margins">
                            {!form.certificateOfService && (
                              <li>Certificate of Service</li>
                            )}
                            {!form.exhibits && <li>Exhibit(s)</li>}
                            {!form.attachments && <li>Attachment(s)</li>}
                            {!form.hasSupportingDocuments && (
                              <li>Supporting Documents</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {fileDocumentHelper.showObjection && (
                        <div className="margin-bottom-0">
                          <label className="usa-label" htmlFor="objections">
                            Are There Any Objections to This Document?
                          </label>
                          {form.objections}
                        </div>
                      )}
                    </div>
                  </div>

                  {form.supportingDocumentFile && (
                    <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        <label
                          className="usa-label"
                          htmlFor="supporting-documents"
                        >
                          {form.supportingDocumentMetadata.documentTitle}
                        </label>
                        <FontAwesomeIcon icon={['fas', 'file-pdf']} />
                        {form.supportingDocumentFile.name}
                      </div>
                    </div>
                  )}

                  {form.secondaryDocument.documentTitle && (
                    <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        {form.secondaryDocumentFile && (
                          <div className="">
                            <label
                              className="usa-label"
                              htmlFor="secondary-filing"
                            >
                              {form.secondaryDocument.documentTitle}
                            </label>
                            <FontAwesomeIcon icon={['fas', 'file-pdf']} />
                            {form.secondaryDocumentFile.name}
                          </div>
                        )}
                      </div>
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        {fileDocumentHelper.showSecondaryFilingNotIncludes && (
                          <div className=" margin-bottom-0">
                            <label
                              className="usa-label"
                              htmlFor="filing-not-includes"
                            >
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
                    </div>
                  )}

                  {form.secondarySupportingDocumentFile && (
                    <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        <label
                          className="usa-label"
                          htmlFor="secondary-supporting-documents"
                        >
                          {
                            form.secondarySupportingDocumentMetadata
                              .documentTitle
                          }
                        </label>
                        <FontAwesomeIcon icon={['fas', 'file-pdf']} />
                        {form.secondarySupportingDocumentFile.name}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="tablet:grid-col-5 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Parties Filing The Document(s)</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <label className="usa-label" htmlFor="filing-parties">
                        Filing Parties
                      </label>
                      <ul className="ustc-unstyled-list without-margins">
                        {form.partyPractitioner && (
                          <li>Myself as Petitioner’s Counsel</li>
                        )}
                        {form.partyPrimary && (
                          <li>{caseDetail.contactPrimary.name}</li>
                        )}
                        {form.partySecondary && (
                          <li>{caseDetail.contactSecondary.name}</li>
                        )}
                        {form.partyRespondent && <li>Respondent</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-row grid-gap">
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

        <div className="button-box-container">
          <button
            className="usa-button margin-bottom-1"
            id="submit-document"
            type="submit"
            onClick={() => {
              submitExternalDocumentSequence();
            }}
          >
            Submit Your Filing
          </button>
          <button
            className="usa-button usa-button--outline margin-bottom-1"
            type="button"
            onClick={() => chooseWizardStepSequence({ value: 'FileDocument' })}
          >
            Back
          </button>
          <button
            className="usa-button usa-button--unstyled"
            type="button"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={submitExternalDocumentSequence}
          />
        )}
      </React.Fragment>
    );
  },
);
