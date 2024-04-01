import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AutoGeneratePetitionForm = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function AutoGeneratePetitionForm({
    form,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <FormGroup className="margin-top-2" errorText={undefined}>
          <label
            className="usa-label"
            htmlFor="petitionReasons"
            id="petition-reasons-label"
          >
            1. Explain why you disagree with the IRS action(s) in this case
            (please add each reason separately):
          </label>

          <div className="grid-row margin-bottom-2">
            <b className="margin-right-1">a.</b>
            <textarea
              aria-describedby="petition-reasons-label"
              className="usa-textarea height-8"
              id="petition-reasons"
              name="petitionReasons"
              value={form.petitionReasons || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <label
            className="usa-label"
            htmlFor="petitionReasons"
            id="petition-facts-label"
          >
            2. State the facts upon which you rely (please add each fact
            separately):
          </label>
          <div className="grid-row margin-bottom-2">
            <b className="margin-right-1">a.</b>
            <textarea
              aria-describedby="petition-facts-label"
              className="usa-textarea height-8"
              id="petition-facts"
              name="petitionFacts"
              value={form.petitionFacts || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
        </FormGroup>
      </>
    );
  },
);

AutoGeneratePetitionForm.displayName = 'AutoGeneratePetitionForm';
