import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UploadCourtIssuedDocument = connect(
  {
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    uploadCourtIssuedDocumentAndUploadAnotherSequence:
      sequences.uploadCourtIssuedDocumentAndUploadAnotherSequence,
    uploadCourtIssuedDocumentSequence:
      sequences.uploadCourtIssuedDocumentSequence,
  },
  ({
    formCancelToggleCancelSequence,
    showModal,
    uploadCourtIssuedDocumentAndUploadAnotherSequence,
    uploadCourtIssuedDocumentSequence,
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
              <div className="grid-col-4">
                <BindedTextarea
                  ariaLabel="notes"
                  bind="form.description"
                  id="upload-description"
                />
              </div>

              <div className="grid-col-8">
                <StateDrivenFileInput
                  aria-describedby="primary-document-label"
                  id="primary-document"
                  name="primaryDocumentFile"
                  updateFormValueSequence="updateFormValueSequence"
                  validationSequence="validateExternalDocumentInformationSequence"
                />
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
