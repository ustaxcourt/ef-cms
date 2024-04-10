import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PetitionFormResponse } from '@web-client/views/StartCaseUpdated/PetitionFormResponse';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AutoGeneratePetitionForm = connect(
  {
    addFactOrReasonSequence: sequences.addFactOrReasonSequence,
    form: state.form,
  },
  function AutoGeneratePetitionForm({ addFactOrReasonSequence, form }) {
    return (
      <>
        <FormGroup className="autogenerate-petition-form" errorText={undefined}>
          <label
            className="usa-label"
            htmlFor="petitionReasons"
            id="petition-reason-label"
          >
            1. Explain why you disagree with the IRS action(s) in this case
            (please add each reason separately):
          </label>

          <div className="margin-bottom-2">
            <ol>
              {form.petitionReasons &&
                form.petitionReasons.map((reason, index) => {
                  return (
                    <PetitionFormResponse
                      count={index}
                      id={`petition-reason-${index - 1}`}
                      key={`petition-reason-${index - 1}`}
                      textName="petitionReasons"
                    />
                  );
                })}
            </ol>
            <Button
              link
              icon="plus"
              onClick={() =>
                addFactOrReasonSequence({ key: 'petitionReasons' })
              }
            >
              Add another reason
            </Button>
          </div>

          <label
            className="usa-label"
            htmlFor="petitionFacts"
            id="petition-fact-label"
          >
            2. State the facts upon which you rely (please add each fact
            separately):
          </label>
          <div className="margin-bottom-2">
            <ol>
              {form.petitionFacts &&
                form.petitionFacts.map((fact, index) => {
                  return (
                    <PetitionFormResponse
                      count={index}
                      id={`petition-fact-${index - 1}`}
                      key={`petition-fact-${index - 1}`}
                      textName="petitionFacts"
                    />
                  );
                })}
            </ol>
            <Button
              link
              icon="plus"
              onClick={() => {
                addFactOrReasonSequence({ key: 'petitionFacts' });
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
