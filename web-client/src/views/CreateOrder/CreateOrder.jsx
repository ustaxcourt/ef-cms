import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { TextEditor } from './TextEditor';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateOrder = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({ form, updateFormValueSequence }) => {
    return (
      <>
        <BigHeader text="Create Order" />
        <section className="usa-section grid-container DocumentDetail">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                <h2 className="heading-1">Create Order</h2>
              </div>
              <div className="grid-col-6">
                <button
                  className="usa-button"
                  onClick={() => {
                    convertHtml2PdfSequence();
                  }}
                >
                  Refresh PDF Preview
                </button>
              </div>
            </div>
          </div>

          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-8">
                <div className="blue-container">
                  <TextEditor
                    form={form}
                    updateFormValueSequence={updateFormValueSequence}
                  />
                </div>
              </div>
              <div className="grid-col-4">
                <PdfPreview />
              </div>
            </div>
          </div>
        </section>
        <div
          className="pdf-preview-div"
          dangerouslySetInnerHTML={{ __html: form.richText }}
          style={{ display: 'none' }}
        ></div>
      </>
    );
  },
);
