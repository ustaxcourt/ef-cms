import { Button } from '@web-client/ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { PDFPreviewButton } from '@web-client/views/PDFPreviewButton';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep6 = connect(
  {
    form: state.form,
    pdfPreviewUrl: state.pdfPreviewUrl,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatedFilePetitionCompleteStep1Sequence:
      sequences.updatedFilePetitionCompleteStep1Sequence,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep6({
    form,
    pdfPreviewUrl,
    updateFormValueSequence,
  }) {
    return (
      <>
        {/* <ErrorNotification /> */}
        <p className="full-width">
          You can’t edit your filing once you submit it. Please make sure your
          information appears the way you want it to.
        </p>
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <WarningNotificationComponent
              alertWarning={{
                message:
                  "Don't forget to check your document(s) to ensure personal information has been removed or redacted.",
              }}
              dismissible={false}
              scrollToTop={false}
            />

            <div className="grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div
                  className={classNames('margin-bottom-4', {
                    'grid-col-12': true,
                    'tablet:grid-col-7': false,
                  })}
                >
                  <div className="card height-full margin-bottom-0">
                    <div className="content-wrapper">
                      <h3 className="underlined">About Your Case</h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col margin-bottom-1">
                          <div className="tablet:margin-bottom-0 margin-bottom-205">
                            <label
                              className="usa-label"
                              htmlFor="primary-filing"
                            >
                              {form.documentTitle}
                            </label>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                {form.petitionType ===
                                PETITION_TYPES.userUploaded ? (
                                  <PDFPreviewButton
                                    file={form.primaryDocumentFile}
                                    title={form.documentTitle}
                                  />
                                ) : (
                                  <a
                                    href={pdfPreviewUrl}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    <FontAwesomeIcon
                                      className="fa-icon-blue"
                                      icon={['fas', 'file-pdf']}
                                    />{' '}
                                    {form.documentTitle}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={classNames('margin-bottom-4', {
                    'grid-col-12': true,
                    'tablet:grid-col-5': false,
                  })}
                >
                  <div className="card height-full margin-bottom-0">
                    <div className="content-wrapper">
                      <h3 className="underlined">Petitioner Information</h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <h3 className="usa-label"></h3>
                          <ul className="ustc-unstyled-list without-margins">
                            <li key={1}>Words words words</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                <div className="grid-row grid-gap">
                  <span className="margin-bottom-1 font-sans-pro">
                    <b>
                      Please read and acknowledge before submitting your filing
                    </b>
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

                <div className="margin-top-4">
                  <Button
                    className="margin-bottom-1"
                    data-testid="petition-review-submit-document"
                    disabled={true}
                    id="submit-document"
                    type="submit"
                    onClick={() => {}}
                  >
                    Submit Your Filing
                  </Button>
                  <Button secondary onClick={() => {}}>
                    Back
                  </Button>
                  <Button link onClick={() => {}}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {form.petitionType === PETITION_TYPES.autoGenerated && (
            <NonMobile>
              <div
                className="grid-col padding-top-1"
                data-testid="petition-pdf-preview"
              >
                <PdfPreview heightOverride={true} />
              </div>
            </NonMobile>
          )}
        </div>

        {/* {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={}
          />
        )} */}
      </>
    );
  },
);
