import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { SuccessNotification } from '../SuccessNotification';
import { TextEditor } from './TextEditor';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateOrder = connect(
  {
    convertHtml2PdfSequence: sequences.convertHtml2PdfSequence,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
    showModal: state.showModal,
    submitCourtIssuedOrderSequence: sequences.submitCourtIssuedOrderSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  ({
    convertHtml2PdfSequence,
    form,
    formCancelToggleCancelSequence,
    pdfPreviewUrl,
    showModal,
    submitCourtIssuedOrderSequence,
    updateFormValueSequence,
    updateScreenMetadataSequence,
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
              <div className="grid-col-8">
                <h2 className="heading-1">Create Order</h2>
              </div>
              <div className="grid-col-3">
                <h2 className="heading-1">Quick Preview</h2>
              </div>
              <div className="grid-col-1">
                <button
                  className="usa-button usa-button--unstyled margin-top-105 minw-10"
                  onClick={() => {
                    convertHtml2PdfSequence();
                  }}
                >
                  <FontAwesomeIcon icon="sync" size="sm" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-8">
                <TextEditor
                  form={form}
                  updateFormValueSequence={updateFormValueSequence}
                  updateScreenMetadataSequence={updateScreenMetadataSequence}
                />
              </div>

              <div className="grid-col-4">
                <PdfPreview />
              </div>
            </div>

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <button
                  className="usa-button"
                  onClick={() => {
                    submitCourtIssuedOrderSequence();
                  }}
                >
                  Complete Order
                </button>
                <button
                  className="usa-button usa-button--unstyled margin-left-2"
                  onClick={() => {
                    formCancelToggleCancelSequence();
                  }}
                >
                  Cancel
                </button>
              </div>

              <div className="grid-col-4">
                <a
                  className="usa-button usa-button--outline"
                  href={pdfPreviewUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View Full PDF
                </a>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
