import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type PetitionFactOrReasonProps = {
  factOrReasonCount: number;
  id: string;
  labelId: string;
  textName: string;
};

const petitionFactOrReasonDependencies = {
  deleteValidationErrorMessageSequence:
    sequences.deleteValidationErrorMessageSequence,
  form: state.form,
  removeFactOrReasonSequence: sequences.removeFactOrReasonSequence,
  updateFormValueSequence: sequences.updateFormValueSequence,
  validationErrors: state.validationErrors,
};

export const PetitionFactOrReason = connect<
  PetitionFactOrReasonProps,
  typeof petitionFactOrReasonDependencies
>(
  petitionFactOrReasonDependencies,
  function PetitionFormResponse({
    deleteValidationErrorMessageSequence,
    factOrReasonCount,
    form,
    id,
    labelId,
    removeFactOrReasonSequence,
    textName,
    updateFormValueSequence,
    validationErrors,
  }) {
    const KEY = `${textName}[${factOrReasonCount}]`;
    const ERROR_KEY_ID = `error_message_${KEY}`;

    return (
      <FormGroup
        className="autogenerate-petition-form"
        errorMessageId={ERROR_KEY_ID}
        errorText={validationErrors[KEY]}
      >
        <div className="fact-or-reason">
          <div className="fact-or-reason-text-area-wrapper">
            <textarea
              aria-labelledby={labelId}
              className="usa-textarea max-width-unset textarea-resize-vertical"
              data-testid={id}
              id={id}
              name={textName}
              style={{ marginTop: '0px' }}
              value={form[textName][factOrReasonCount] || ''}
              onChange={e => {
                updateFormValueSequence({
                  allowEmptyString: true,
                  index: factOrReasonCount,
                  key: e.target.name,
                  value: e.target.value,
                });
                deleteValidationErrorMessageSequence({
                  validationKey: [KEY],
                });
              }}
            />
            <div className="fact-or-reason-button-wrapper">
              {factOrReasonCount > 0 && (
                <Button
                  link
                  icon="times"
                  onClick={() =>
                    removeFactOrReasonSequence({
                      index: factOrReasonCount,
                      key: textName,
                    })
                  }
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </FormGroup>
    );
  },
);

PetitionFactOrReason.displayName = 'PetitionFactOrReason';
