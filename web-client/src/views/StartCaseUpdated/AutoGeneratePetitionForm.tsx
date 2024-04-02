import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AutoGeneratePetitionForm = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function AutoGeneratePetitionForm({
    factCount = 1,
    form,
    reasonCount = 1,
    updateFormValueSequence,
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
            <li
              style={{
                fontWeight: 'bold',
                listStyleType: 'lower-alpha',
                marginRight: '1rem',
              }}
            ></li>
            <textarea
              aria-describedby="petition-reasons-label"
              className="usa-textarea height-8"
              id="petition-reasons"
              name="petitionReasons"
              value={form.petitionReasons[reasonCount - 1] || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name[reasonCount - 1],
                  value: e.target.value,
                });
              }}
            />
            <Button
              link
              icon="plus"
              onClick={() => {
                reasonCount++;
              }}
            >
              Add another reason
            </Button>
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
            <li
              style={{
                fontWeight: 'bold',
                listStyleType: 'lower-alpha',
                marginRight: '1rem',
              }}
            ></li>
            <textarea
              aria-describedby="petition-facts-label"
              className="usa-textarea height-8"
              id="petition-facts"
              name="petitionFacts"
              value={form.petitionFacts[factCount - 0] || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name[factCount - 0],
                  value: e.target.value,
                });
              }}
            />
            <Button
              link
              icon="plus"
              onClick={() => {
                factCount++;
              }}
            >
              Add another fact
            </Button>
          </div>
        </FormGroup>
      </>
    );
  },
);

AutoGeneratePetitionForm.displayName = 'AutoGeneratePetitionForm';
