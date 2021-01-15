import { Button } from '../../ustc-ui/Button/Button';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FiledInMultiCasesReview } from './FiledInMultiCasesReview';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { MultiDocumentPartiesFilingReview } from './MultiDocumentPartiesFilingReview';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const FileDocumentReview = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    navigateBackSequence: sequences.navigateBackSequence,
    showModal: state.modal.showModal,
    submitExternalDocumentSequence: sequences.submitExternalDocumentSequence,
  },
  function FileDocumentReview({
    fileDocumentHelper,
    form,
    formattedCaseDetail,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    showModal,
    submitExternalDocumentSequence,
  }) {
    const secondaryDocument = () => (
      <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
        <div className="tablet:grid-col-6 margin-bottom-1">
          <div className="tablet:margin-bottom-0 margin-bottom-205">
            <div className="">
              <label className="usa-label" htmlFor="secondary-filing">
                {form.secondaryDocument.documentTitle}{' '}
              </label>
              {(form.secondaryDocumentFile &&
                form.secondaryDocumentFile.name && (
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <PDFPreviewButton
                        file={form.secondaryDocumentFile}
                        title={form.secondaryDocument.documentTitle}
                      />
                    </div>
                  </div>
                )) ||
                'No file attached'}
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-6 margin-bottom-1">
          {fileDocumentHelper.showSecondaryFilingIncludes && (
            <div
              className={classNames(
                !fileDocumentHelper.secondaryDocument.showObjection
                  ? 'margin-bottom-0'
                  : 'margin-bottom-5',
              )}
            >
              <label className="usa-label" htmlFor="filing-includes">
                Document includes
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {form.secondaryDocument.certificateOfService && (
                  <li>
                    Certificate of Service{' '}
                    {
                      fileDocumentHelper.secondaryDocument
                        .certificateOfServiceDateFormatted
                    }
                  </li>
                )}
                {form.secondaryDocument.attachments && <li>Attachment(s)</li>}
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
    );
    const supportingDocuments = () =>
      form.supportingDocuments.map((item, idx) => (
        <div
          className="grid-row grid-gap overline padding-top-105 margin-top-105"
          key={`supporting-doc-${idx}`}
        >
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
                  <PDFPreviewButton
                    file={item.supportingDocumentFile}
                    title={item.documentTitle}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tablet:grid-col-6 margin-bottom-1">
            {fileDocumentHelper.supportingDocuments[idx].showFilingIncludes && (
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
      ));

    const secondarySupportingDocuments = () =>
      form.secondarySupportingDocuments.map((item, idx) => (
        <div
          className="grid-row grid-gap overline padding-top-105 margin-top-105"
          key={`secondary-supporting-doc-${idx}`}
        >
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
                  <PDFPreviewButton
                    file={item.supportingDocumentFile}
                    title={item.documentTitle}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tablet:grid-col-6 margin-bottom-1">
            {fileDocumentHelper.secondarySupportingDocuments[idx]
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
                        fileDocumentHelper.secondarySupportingDocuments[idx]
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
      ));

    return (
      <>
        <Focus>
          <h1
            className="heading-1 margin-bottom-0"
            id="file-a-document-header"
            tabIndex="-1"
          >
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
                          className={classNames(
                            !fileDocumentHelper.primaryDocument.showObjection
                              ? 'margin-bottom-0'
                              : 'margin-bottom-5',
                          )}
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

                  {form.supportingDocuments && supportingDocuments()}

                  {fileDocumentHelper.showSecondaryDocument &&
                    secondaryDocument()}

                  {form.secondarySupportingDocuments &&
                    secondarySupportingDocuments()}
                </div>
              </div>
            </div>

            <div className="tablet:grid-col-5 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  {fileDocumentHelper.showMultiDocumentFilingPartyForm && (
                    <FiledInMultiCasesReview />
                  )}
                  {!fileDocumentHelper.showMultiDocumentFilingPartyForm && (
                    <>
                      <h3 className="underlined">
                        Parties Filing The Document(s)
                      </h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <label className="usa-label" htmlFor="filing-parties">
                            Filing parties
                          </label>
                          <ul className="ustc-unstyled-list without-margins">
                            {form.partyPrimary && (
                              <li>
                                {formattedCaseDetail.contactPrimary.name},
                                Petitioner
                              </li>
                            )}
                            {form.partySecondary && (
                              <li>
                                {formattedCaseDetail.contactSecondary.name},
                                Petitioner
                              </li>
                            )}
                            {form.partyIrsPractitioner && <li>Respondent</li>}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {fileDocumentHelper.showMultiDocumentFilingPartyForm && (
          <div className="grid-row grid-gap margin-bottom-5">
            <div className="tablet:grid-col-12">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Parties Filing The Document(s)</h3>
                  <div className="grid-row grid-gap">
                    <MultiDocumentPartiesFilingReview
                      selectedCases={
                        fileDocumentHelper.formattedSelectedCasesAsCase
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid-row grid-gap margin-bottom-5">
          <div className="tablet:grid-col-12 bg-white submit-reminders">
            <div className="card">
              <div className="content-header bg-accent-cool-dark text-white heading-3">
                A Few Reminders Before You Submit
              </div>
              <div className="content-wrapper">
                <ol className="numbered-list">
                  <li>
                    Double check that the PDF files you’ve selected are correct.
                  </li>
                  <li>
                    Be sure you’ve removed or redacted all personal information
                    from your documents.
                  </li>
                  <li>
                    Indicate any related documents that you’ve included with
                    your filing.
                  </li>
                  <li>
                    Confirm everything appears as you want it to—you can’t edit
                    your filing after you submit it.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <Button
          id="submit-document"
          type="submit"
          onClick={() => {
            submitExternalDocumentSequence();
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
            confirmSequence={submitExternalDocumentSequence}
          />
        )}
      </>
    );
  },
);
