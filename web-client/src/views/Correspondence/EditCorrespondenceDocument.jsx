import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { DocumentDisplayIframe } from '../DocumentDetail/DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditCorrespondenceDocument = connect(
  {
    documentToEdit: state.documentToEdit,
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
  function EditCorrespondenceDocument({
    documentToEdit,
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
        <CaseDetailHeader hideActionButtons />
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}

        <section className="usa-section grid-container DocumentDetail">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-12">
                <h2 className="heading-1">
                  Edit {documentToEdit.documentTitle}
                </h2>
              </div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <div className="blue-container upload-court-document-description-container">
                  <FormGroup
                    errorText={validationErrors && validationErrors.freeText}
                  >
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
                      name="freeText"
                      type="text"
                      value={form.freeText || ''}
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
                  <DocumentDisplayIframe />
                </div>
              </div>
            </div>

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <Button
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
