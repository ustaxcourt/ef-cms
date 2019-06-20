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
          <h2 className="heading-1">A Header</h2>
          <SuccessNotification />
          <ErrorNotification />

          <div className="blue-container">
            <TextEditor
              form={form}
              updateFormValueSequence={updateFormValueSequence}
            />
            {form.richText}
          </div>
        </section>
      </>
    );
  },
);
