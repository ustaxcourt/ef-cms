import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const UploadCorrespondenceDocument = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    uploadCorrespondenceDocumentSequence:
      sequences.uploadCorrespondenceDocumentSequence,
    validateUploadCorrespondenceDocumentSequence:
      sequences.validateUploadCorrespondenceDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function UploadCorrespondenceDocument({
    constants,
    fileDocumentHelper,
    form,
    formCancelToggleCancelSequence,
    showModal,
    updateFormValueSequence,
    uploadCorrespondenceDocumentSequence,
    validateUploadCorrespondenceDocumentSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />

        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}

        <section className="usa-section grid-container DocumentDetail">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-12">
                <h2 className="heading-1">Add Correspondence File</h2>
              </div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <div className="blue-container upload-court-document-description-container">
                  <FormGroup errorText={validationErrors?.documentTitle}>
                    <label
                      className="usa-label"
                      htmlFor="upload-description"
                      id="upload-description-label"
                    >
                      Correspondence description
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

              <div className="grid-col-7">
                <div className="scanner-area-header">
                  <div className="grid-container padding-x-0">
                    <div className="grid-row grid-gap">
                      <div className="grid-col-6">
                        <h3 className="margin-bottom-0 margin-left-105">
                          Add Document
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="document-select-container">
                  <FormGroup errorText={validationErrors?.primaryDocumentFile}>
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
              </div>
            </div>

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <Button
                  id="upload-correspondence"
                  onClick={() => {
                    uploadCorrespondenceDocumentSequence({
                      tab: 'correspondence',
                    });
                  }}
                >
                  Finish
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
