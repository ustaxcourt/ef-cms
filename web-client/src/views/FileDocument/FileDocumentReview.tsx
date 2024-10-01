/* eslint-disable complexity */

import { Button } from '../../ustc-ui/Button/Button';
import { ExternalConsolidatedGroupCards } from './ExternalConsolidatedGroupCards';
import { FileEntryOfAppearanceReview } from '@web-client/views/FileDocument/FileEntryOfAppearanceReview';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { PIIRedactedWarning } from '@web-client/views/CaseAssociationRequest/PIIRedactedWarning';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const FileDocumentReview = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
    showModal: state.modal.showModal,
    submitExternalDocumentSequence: sequences.submitExternalDocumentSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function FileDocumentReview({
    fileDocumentHelper,
    form,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    pdfPreviewUrl,
    showModal,
    submitExternalDocumentSequence,
    updateFormValueSequence,
  }) {
    const secondaryDocument = () => (
      <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
        <div className="tablet:grid-col-6 margin-bottom-1">
          <div className="tablet:margin-bottom-0 margin-bottom-205">
            <div>
              <label className="usa-label" htmlFor="secondary-filing">
                {form.secondaryDocument.documentTitle}{' '}
              </label>
              {(form.secondaryDocumentFile &&
                form.secondaryDocumentFile.name && (
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <PDFPreviewButton
                        file={form.secondaryDocumentFile}
                        showIcon={false}
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
          key={`supporting-doc-${item.documentTitle}`}
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
                    showIcon={false}
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
          key={`secondary-supporting-doc-${item.documentTitle}`}
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
                    showIcon={false}
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
        {fileDocumentHelper.isAutoGenerated ? (
          <FileEntryOfAppearanceReview
            documentTitle={form.documentTitle}
            pdfPreviewUrl={pdfPreviewUrl}
            showModal={showModal}
            onBack={() => navigateBackSequence()}
            onCancel={() => formCancelToggleCancelSequence()}
            onSubmit={() => submitExternalDocumentSequence()}
          />
        ) : (
          <>
            <Focus>
              <h1
                className="heading-1 margin-bottom-0"
                id="file-a-document-header"
                tabIndex={-1}
              >
                Review Your Filing
              </h1>
            </Focus>

            <p>
              You can’t edit your filing once you submit it. Please make sure
              your information appears the way you want it to.
            </p>
            <PIIRedactedWarning />
            <div className="grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div className="tablet:grid-col-7 margin-bottom-4">
                  <div className="card height-full margin-bottom-0">
                    <div className="content-wrapper">
                      <h3 className="underlined">Your Document(s)</h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <div className="tablet:margin-bottom-0 margin-bottom-205">
                            <h3 className="usa-label">{form.documentTitle}</h3>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <PDFPreviewButton
                                  file={form.primaryDocumentFile}
                                  showIcon={false}
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
                                !fileDocumentHelper.primaryDocument
                                  .showObjection
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
                      <h3 className="underlined">
                        Parties Filing The Document(s)
                      </h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-12 margin-bottom-1">
                          <h3 className="usa-label">Filing parties</h3>
                          <ul className="ustc-unstyled-list without-margins">
                            {fileDocumentHelper.formattedFilingParties.map(
                              party => (
                                <li
                                  data-testid={`filingParty-${party}`}
                                  key={party}
                                >
                                  {party}
                                </li>
                              ),
                            )}
                            {form.partyIrsPractitioner && <li>Respondent</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {form.fileAcrossConsolidatedGroup && (
                <ExternalConsolidatedGroupCards />
              )}
            </div>

            <div className="grid-row grid-gap margin-bottom-5">
              <div className="tablet:grid-col-12 bg-white submit-reminders">
                <div className="card">
                  <div className="content-header bg-accent-cool-dark text-white heading-3">
                    A Few Reminders Before You Submit
                  </div>
                  <div className="content-wrapper">
                    <ol className="numbered-list">
                      <li>
                        Double check that the PDF files you’ve selected are
                        correct.
                      </li>
                      <li>
                        Be sure you’ve removed or redacted all personal
                        information from your documents.
                      </li>
                      <li>
                        Indicate any related documents that you’ve included with
                        your filing.
                      </li>
                      <li>
                        Confirm everything appears as you want it to—you can’t
                        edit your filing after you submit it.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-row grid-gap">
              <span className="margin-bottom-1 font-sans-pro">
                <b>Please read and acknowledge before submitting your filing</b>
              </span>
              <div className="tablet:grid-col-12">
                <div className="card">
                  <div className="content-wrapper usa-checkbox">
                    <input
                      aria-describedby="redaction-acknowledgement-label"
                      checked={form.redactionAcknowledgement || false}
                      className="usa-checkbox__input"
                      id="redaction-acknowledgement"
                      name="redactionAcknowledgement"
                      type="checkbox"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      data-testid="redaction-acknowledgement-label"
                      htmlFor="redaction-acknowledgement"
                      id="redaction-acknowledgement-label"
                    >
                      <b>
                        All documents I am filing have been redacted in
                        accordance with{' '}
                        <a
                          href="https://ustaxcourt.gov/resources/ropp/Rule-27_Amended_03202023.pdf"
                          rel="noreferrer"
                          target="_blank"
                        >
                          Rule 27
                        </a>
                        .
                      </b>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="margin-top-2">
              <Button
                className="margin-bottom-1"
                data-testid="file-document-review-submit-document"
                disabled={!form.redactionAcknowledgement}
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
            </div>

            {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
          </>
        )}
      </>
    );
  },
);

FileDocumentReview.displayName = 'FileDocumentReview';
