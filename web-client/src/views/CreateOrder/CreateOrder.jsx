import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview';
import { SuccessNotification } from '../SuccessNotification';
import { TextEditor } from './TextEditor';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateOrder = connect(
  {
    convertHtml2PdfSequence: sequences.convertHtml2PdfSequence,
    createOrderHelper: state.createOrderHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    convertHtml2PdfSequence,
    createOrderHelper,
    form,
    updateFormValueSequence,
  }) => {
    return (
      <>
        <CaseDetailHeader />
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
                  className="usa-button usa-button--unstyled margin-top-105"
                  onClick={() => {
                    convertHtml2PdfSequence({
                      htmlString: createOrderHelper.pdfTemplate,
                    });
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
                />
              </div>

              <div className="grid-col-4">
                <PdfPreview />
              </div>
            </div>

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <button className="usa-button">Complete Order</button>
                <button className="usa-button usa-button--unstyled margin-left-2">
                  Cancel
                </button>
              </div>

              <div className="grid-col-4">
                <button className="usa-button usa-button--outline">
                  View Full PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
