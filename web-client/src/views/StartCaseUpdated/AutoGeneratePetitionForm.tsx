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
        <FormGroup className="autogenerate-petition-form">
          <label
            className="usa-label"
            htmlFor="petitionReasons"
            id="petition-reason-label"
          >
            1. Explain why you disagree with the IRS action(s) in this case
            (please add each reason separately):
          </label>

          <div className="margin-bottom-2-rem">
            {form.petitionReasons &&
              form.petitionReasons.map((_reason, index) => {
                const key = `petition-reason-${index - 1}`;
                return (
                  <div className="display-flex" key={key}>
                    <div className="text-semibold margin-right-05">
                      {getCharacter(index)}
                    </div>
                    <PetitionFormResponse
                      factOrReasonCount={index}
                      id={`petition-reason-${index - 1}`}
                      labelId="petition-reason-label"
                      textName="petitionReasons"
                    />
                  </div>
                );
              })}
            <Button
              link
              className="add-another-reason-button"
              data-testid="add-another-reason-link-button"
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
          <div>
            {form.petitionFacts &&
              form.petitionFacts.map((_fact, index) => {
                const key = `petition-fact-${index - 1}`;
                return (
                  <div className="display-flex" key={key}>
                    <div className="text-semibold margin-right-05">
                      {getCharacter(index)}
                    </div>
                    <PetitionFormResponse
                      factOrReasonCount={index}
                      id={`petition-fact-${index - 1}`}
                      labelId="petition-fact-label"
                      textName="petitionFacts"
                    />
                  </div>
                );
              })}
          </div>
          <div>
            <Button
              link
              className="add-another-fact-button"
              data-testid="add-another-fact-link-button"
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

function getCharacter(index: number): string {
  const asciiOfA = 97;
  const asciiValue = asciiOfA + index;
  return `${String.fromCharCode(asciiValue)}. `;
}

AutoGeneratePetitionForm.displayName = 'AutoGeneratePetitionForm';
