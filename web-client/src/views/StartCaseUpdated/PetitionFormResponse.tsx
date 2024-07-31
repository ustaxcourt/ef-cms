import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type PetitionFormResponseProps = {
  factOrReasonCount: number;
  id: string;
  labelId: string;
  textName: string;
};

const petitionFormResponseDependencies = {
  deleteValidationErrorMessageSequence:
    sequences.deleteValidationErrorMessageSequence,
  form: state.form,
  removeFactOrReasonSequence: sequences.removeFactOrReasonSequence,
  updateFormValueSequence: sequences.updateFormValueSequence,
  validationErrors: state.validationErrors,
};

export const PetitionFormResponse = connect<
  PetitionFormResponseProps,
  typeof petitionFormResponseDependencies
>(
  petitionFormResponseDependencies,
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
          <NonMobile>
            <div style={{ display: 'flex' }}>
              <div>
                <textarea
                  aria-labelledby={labelId}
                  className="usa-textarea max-width-unset"
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
              </div>
              {factOrReasonCount > 0 && (
                <Button
                  link
                  className="reason-button remove-fact-reason-button"
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
          </NonMobile>

          <Mobile>
            <div>
              <textarea
                aria-labelledby={labelId}
                className="usa-textarea"
                data-testid={id}
                id={id}
                name={textName}
                style={{ marginTop: '0px', width: '100%' }}
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
            </div>
            {factOrReasonCount > 0 && (
              <Button
                link
                className="reason-button remove-fact-reason-button"
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
          </Mobile>
        </div>
      </FormGroup>
    );
  },
);

PetitionFormResponse.displayName = 'PetitionFormResponse';
