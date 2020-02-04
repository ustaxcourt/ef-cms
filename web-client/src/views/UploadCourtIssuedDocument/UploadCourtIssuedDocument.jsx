import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UploadCourtIssuedDocument = connect(
  {
    constants: state.constants,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    uploadCourtIssuedDocumentAndUploadAnotherSequence:
      sequences.uploadCourtIssuedDocumentAndUploadAnotherSequence,
    uploadCourtIssuedDocumentSequence:
      sequences.uploadCourtIssuedDocumentSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    formCancelToggleCancelSequence,
    showModal,
    uploadCourtIssuedDocumentAndUploadAnotherSequence,
    uploadCourtIssuedDocumentSequence,
    validationErrors,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        <SuccessNotification />
        <ErrorNotification />

        <section className="usa-section grid-container DocumentDetail">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-12">
                <h2 className="heading-1">Upload Document</h2>
              </div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <div
                  className="blue-container"
                  style={{ 'min-height': '471px' }}
                >
                  <FormGroup
                    errorText={validationErrors && validationErrors.freeText}
                  >
                    <label
                      className="usa-label"
                      htmlFor="upload-description"
                      id="upload-description-label"
                    >
                      Document Description
                    </label>
                    <BindedTextarea
                      aria-labelledby="upload-description-label"
                      ariaLabel="notes"
                      bind="form.freeText"
                      id="upload-description"
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
                  <FormGroup errorText={validationErrors.primaryDocumentFile}>
                    <label
                      className="usa-label with-hint"
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
                      id="primary-document"
                      name="primaryDocumentFile"
                      updateFormValueSequence="updateFormValueSequence"
                      validationSequence="validateExternalDocumentInformationSequence"
                    />
                  </FormGroup>
                </div>
              </div>
            </div>

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <Button
                  onClick={() => {
                    uploadCourtIssuedDocumentSequence();
                  }}
                >
                  Save Order
                </Button>
                <Button
                  secondary
                  onClick={() => {
                    uploadCourtIssuedDocumentAndUploadAnotherSequence();
                  }}
                >
                  Add Another Entry
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
