import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocumentReviewRedesign = connect(
  {
    caseDetail: state.formattedCaseDetail,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    submitExternalDocumentSequence: sequences.submitExternalDocumentSequence,
  },
  ({
    caseDetail,
    fileDocumentHelper,
    form,
    formCancelToggleCancelSequence,
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
                      {fileDocumentHelper.showFilingIncludes && (
                        <div
                          className={` ${
                            !fileDocumentHelper.primaryDocument.showObjection
                              ? 'margin-bottom-0'
                              : 'margin-bottom-5'
                          }`}
                        >
                          <label
                            className="usa-label"
                            htmlFor="filing-includes"
                          >
                            Document Includes
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
                            {form.attachments && <li>Attachment(s)</li>}
                          </ul>
                        </div>
                      )}

                      {fileDocumentHelper.primaryDocument.showObjection && (
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
                                  Document Includes
                                </label>
                                <ul className="ustc-unstyled-list without-margins">
                                  {item.certificateOfServiceDate && (
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

                  {form.secondaryDocument.documentTitle && (
                    <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        <div className="tablet:margin-bottom-0 margin-bottom-205">
                          {form.secondaryDocumentFile && (
                            <div className="">
                              <label
                                className="usa-label"
                                htmlFor="secondary-filing"
                              >
                                {form.secondaryDocument.documentTitle}{' '}
                              </label>
                              {(form.secondaryDocumentFile &&
                                form.secondaryDocumentFile.name && (
                                  <React.Fragment>
                                    <div className="grid-row">
                                      <div className="grid-col flex-auto">
                                        <FontAwesomeIcon
                                          className="fa-icon-blue"
                                          icon={['fas', 'file-pdf']}
                                        />
                                      </div>
                                      <div className="grid-col flex-fill">
                                        <PDFPreviewButton
                                          file={form.secondaryDocumentFile}
                                          title={
                                            form.secondaryDocument.documentTitle
                                          }
                                        />
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )) ||
                                'No file attached'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        {fileDocumentHelper.showSecondaryFilingIncludes && (
                          <div
                            className={` ${
                              !fileDocumentHelper.secondaryDocument
                                .showObjection
                                ? 'margin-bottom-0'
                                : 'margin-bottom-5'
                            }`}
                          >
                            <label
                              className="usa-label"
                              htmlFor="filing-includes"
                            >
                              Document Includes
                            </label>
                            <ul className="ustc-unstyled-list without-margins">
                              {form.secondaryDocument
                                .certificateOfServiceDate && (
                                <li>
                                  Certificate of Service{' '}
                                  {
                                    fileDocumentHelper.secondaryDocument
                                      .certificateOfServiceDateFormatted
                                  }
                                </li>
                              )}
                              {form.secondaryDocument.attachments && (
                                <li>Attachment(s)</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {fileDocumentHelper.secondaryDocument.showObjection && (
                          <div className="margin-bottom-0">
                            <label className="usa-label" htmlFor="objections">
                              Objections?
                            </label>
                            {form.secondaryDocument.objections}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {form.secondarySupportingDocuments &&
                    form.secondarySupportingDocuments.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
                          <div className="tablet:grid-col-6 margin-bottom-1">
                            <div className="tablet:margin-bottom-0 margin-bottom-205">
                              <label
                                className="usa-label"
                                htmlFor={`secondary-supporting-documents-${idx}`}
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
                            {fileDocumentHelper.secondarySupportingDocuments[
                              idx
                            ].showFilingIncludes && (
                              <div className="margin-bottom-0">
                                <label
                                  className="usa-label"
                                  htmlFor="filing-includes"
                                >
                                  Document Includes
                                </label>
                                <ul className="ustc-unstyled-list without-margins">
                                  {item.certificateOfServiceDate && (
                                    <li>
                                      Certificate of Service{' '}
                                      {
                                        fileDocumentHelper
                                          .secondarySupportingDocuments[idx]
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
                        {form.partyPrimary && (
                          <li>{caseDetail.contactPrimary.name}, Petitioner</li>
                        )}
                        {form.partySecondary && (
                          <li>
                            {caseDetail.contactSecondary.name}, Petitioner
                          </li>
                        )}
                        {form.partyPractitioner && (
                          <li>{caseDetail.practitioners[0].name}, Counsel</li>
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
            onClick={() => history.back()}
          >
            Back
          </button>
          <button
            className="usa-button usa-button--unstyled ustc-button--unstyled"
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
