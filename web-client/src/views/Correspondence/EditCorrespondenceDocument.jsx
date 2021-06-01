import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { DocumentDisplayIframe } from '../DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const EditCorrespondenceDocument = connect(
  {
    clearExistingDocumentSequence: sequences.clearExistingDocumentSequence,
    constants: state.constants,
    editCorrespondenceDocumentSequence:
      sequences.editCorrespondenceDocumentSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    formattedDocument: state.formattedDocument,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateUploadCorrespondenceDocumentSequence:
      sequences.validateUploadCorrespondenceDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditCorrespondenceDocument({
    clearExistingDocumentSequence,
    constants,
    editCorrespondenceDocumentSequence,
    fileDocumentHelper,
    form,
    formattedDocument,
    formCancelToggleCancelSequence,
    screenMetadata,
    showModal,
    updateFormValueSequence,
    validateUploadCorrespondenceDocumentSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="cancelAndNavigateToCorrespondenceSequence" />
        )}

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {screenMetadata.documentReset && (
            <Hint>When you submit it will overwrite the previous document</Hint>
          )}
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-12">
                <h2 className="heading-1" id="edit-correspondence-header">
                  Edit {formattedDocument.documentTitle}
                </h2>
              </div>
            </div>

            <div className="grid-row grid-gap">
              <div className="desktop:grid-col-5 tablet:grid-row">
                <div className="blue-container desktop:upload-court-document-description-container">
                  <FormGroup errorText={validationErrors?.documentTitle}>
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
                      id="upload-description"
                      name="documentTitle"
                      type="text"
                      value={form.documentTitle || ''}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateUploadCorrespondenceDocumentSequence();
                      }}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="desktop:grid-col-7 tablet:grid-row">
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
                          validationSequence="validateUploadCorrespondenceDocumentSequence"
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

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <Button
                  onClick={() => {
                    editCorrespondenceDocumentSequence({
                      tab: 'correspondence',
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
        </section>
      </>
    );
  },
);
