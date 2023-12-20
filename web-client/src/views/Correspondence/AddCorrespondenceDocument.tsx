import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ScanBatchPreviewer } from '../ScanBatchPreviewer';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddCorrespondenceDocument = connect(
  {
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
  function AddCorrespondenceDocument({
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
              </div>

              <div className="grid-col-7">
                <ScanBatchPreviewer
                  documentType="primaryDocumentFile"
                  title="Add Document"
                  validateSequence={
                    validateUploadCorrespondenceDocumentSequence
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);

AddCorrespondenceDocument.displayName = 'AddCorrespondenceDocument';
