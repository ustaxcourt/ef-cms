import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PetitionFactOrReason } from '@web-client/views/StartCaseUpdated/PetitionFactOrReason';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AutoGeneratePetitionForm = connect(
  {
    addFactOrReasonSequence: sequences.addFactOrReasonSequence,
    filePetitionHelper: state.filePetitionHelper,
    form: state.form,
  },

  function AutoGeneratePetitionForm({
    addFactOrReasonSequence,
    filePetitionHelper,
    form,
  }) {
    const { isPetitioner } = filePetitionHelper;

    return (
      <>
        <FormGroup className="autogenerate-petition-form">
          <label
            className="usa-label"
            htmlFor="petitionReasons"
            id="petition-reason-label"
          >
            {`1. Explain why ${isPetitioner ? 'you disagree' : 'the petitioner disagrees'} with the IRS action(s) in this case
            (please add each reason separately)`}
            :
          </label>

          <div className="margin-bottom-2-rem">
            {form.petitionReasons &&
              form.petitionReasons.map((_reason, index) => {
                const key = `petition-reason-${index - 1}`;
                return (
                  <div className="display-flex" key={key}>
                    <div className="text-semibold margin-right-1 fact-reason-character-label">
                      {`${filePetitionHelper.getLetterByIndex(index)}. `}
                    </div>
                    <PetitionFactOrReason
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
            {`2. State the facts upon which ${isPetitioner ? 'you rely' : 'the petitioner relies'} (please add each fact
            separately):`}
          </label>
          <div>
            {form.petitionFacts &&
              form.petitionFacts.map((_fact, index) => {
                const key = `petition-fact-${index - 1}`;
                return (
                  <div className="display-flex" key={key}>
                    <div className="text-semibold margin-right-1 fact-reason-character-label">
                      {`${filePetitionHelper.getLetterByIndex(index)}. `}
                    </div>
                    <PetitionFactOrReason
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

AutoGeneratePetitionForm.displayName = 'AutoGeneratePetitionForm';
