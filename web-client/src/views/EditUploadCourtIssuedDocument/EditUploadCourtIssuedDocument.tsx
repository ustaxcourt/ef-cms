import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { DocumentDisplayIframe } from '../DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InfoNotificationComponent } from '../InfoNotification';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const EditUploadCourtIssuedDocument = connect(
  {
    clearExistingDocumentSequence: sequences.clearExistingDocumentSequence,
    closeModalAndReturnToCaseDetailDraftDocumentsSequence:
      sequences.closeModalAndReturnToCaseDetailDraftDocumentsSequence,
    constants: state.constants,
    editUploadCourtIssuedDocumentSequence:
      sequences.editUploadCourtIssuedDocumentSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateUploadCourtIssuedDocumentSequence:
      sequences.validateUploadCourtIssuedDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditUploadCourtIssuedDocument({
    clearExistingDocumentSequence,
    closeModalAndReturnToCaseDetailDraftDocumentsSequence,
    constants,
    editUploadCourtIssuedDocumentSequence,
    fileDocumentHelper,
    form,
    formCancelToggleCancelSequence,
    screenMetadata,
    showModal,
    updateFormValueSequence,
    validateUploadCourtIssuedDocumentSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog
            onCancelSequence={
              closeModalAndReturnToCaseDetailDraftDocumentsSequence
            }
          />
        )}

        <section className="usa-section grid-container DocumentDetail">
          <SuccessNotification />
          <ErrorNotification />
          {screenMetadata.documentReset && (
            <InfoNotificationComponent
              alertInfo={{
                message: 'Saving will replace the previous document.',
              }}
              dismissible={false}
              scrollToTop={false}
            />
          )}
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-12">
                <h2 className="heading-1">Upload PDF</h2>
              </div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <div className="blue-container upload-court-document-description-container">
                  <FormGroup errorText={validationErrors?.freeText}>
                    <label
                      className="usa-label"
                      htmlFor="upload-description"
                      id="upload-description-label"
                    >
                      Description
                    </label>
                    <input
                      aria-labelledby="upload-description-label"
                      autoCapitalize="none"
                      className="usa-input"
                      data-testid="upload-description"
                      id="upload-description"
                      name="freeText"
                      type="text"
                      value={form.freeText || ''}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateUploadCourtIssuedDocumentSequence();
                      }}
                    />
                  </FormGroup>
                </div>
                <div className="grid-row grid-gap margin-top-4">
                  <div className="grid-col-8">
                    <Button
                      data-testid="save-edited-pdf-button"
                      id="save-edited-pdf-button"
                      onClick={() => {
                        editUploadCourtIssuedDocumentSequence({
                          tab: 'drafts',
                        });
                      }}
                    >
                      Save
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
                </div>
              </div>

              <div className="grid-col-7">
                {(screenMetadata.documentReset && (
                  <>
                    <div className="scanner-area-header">
                      <div className="grid-container padding-x-0">
                        <div className="grid-row grid-gap">
                          <div className="grid-col-6">
                            <h3 className="margin-bottom-0 margin-left-105">
                              Add PDF
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="document-select-container">
                      <FormGroup
                        errorText={validationErrors.primaryDocumentFile}
                      >
                        <label
                          className={classNames(
                            'usa-label ustc-upload with-hint',
                            fileDocumentHelper.showPrimaryDocumentValid &&
                              'validated',
                          )}
                          htmlFor="primary-document-file"
                          id="primary-document-label"
                        >
                          Upload your file{' '}
                          <span className="success-message">
                            <FontAwesomeIcon icon="check-circle" size="1x" />
                          </span>
                        </label>
                        <span className="usa-hint">
                          File must be in PDF format (.pdf). Max file size{' '}
                          {constants.MAX_FILE_SIZE_MB}MB.
                        </span>

                        <StateDrivenFileInput
                          aria-describedby="primary-document-label"
                          id="primary-document-file"
                          name="primaryDocumentFile"
                          updateFormValueSequence="updateFormValueSequence"
                          validationSequence="validateUploadCourtIssuedDocumentSequence"
                        />
                      </FormGroup>
                    </div>
                  </>
                )) || (
                  <>
                    <div className="scanner-area-header">
                      <div className="grid-container padding-x-0">
                        <div className="grid-row grid-gap">
                          <div className="grid-col-12">
                            <h3 className="margin-bottom-0 margin-left-105">
                              View PDF
                              <Button
                                link
                                aria-label="Change existing PDF"
                                className="set-right"
                                id="cancel-button"
                                onClick={() => {
                                  clearExistingDocumentSequence();
                                }}
                              >
                                Change
                              </Button>
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DocumentDisplayIframe />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);

EditUploadCourtIssuedDocument.displayName = 'EditUploadCourtIssuedDocument';
