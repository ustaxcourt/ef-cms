import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  count: number;
  id: string;
  textName: string;
};

export const PetitionFormResponse = connect(
  {
    count: props.count,
    deleteValidationErrorMessageSequence:
      sequences.deleteValidationErrorMessageSequence,
    form: state.form,
    id: props.id,
    removeFactOrReasonSequence: sequences.removeFactOrReasonSequence,
    textName: props.textName,
    updatePetitionFormValueSequence: sequences.updatePetitionFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PetitionFormResponse({
    count,
    deleteValidationErrorMessageSequence,
    form,
    id,
    removeFactOrReasonSequence,
    textName,
    updatePetitionFormValueSequence,
    validationErrors,
  }) {
    const KEY = `${textName}[${count}]`;
    const ERROR_KEY_ID = `error_message_${KEY}`;

    return (
      <FormGroup
        className="autogenerate-petition-form"
        errorMessageId={ERROR_KEY_ID}
        errorText={validationErrors[KEY]}
      >
        <div className="fact-or-reason">
          {/* TODO: move to scss */}
          <li
            style={{
              fontWeight: 600,
              listStyleType: 'lower-alpha',
            }}
          >
            <NonMobile>
              <div style={{ display: 'flex' }}>
                <div>
                  <textarea
                    aria-describedby={`${id}-label`}
                    className="usa-textarea max-width-unset"
                    data-testid={id}
                    id={id}
                    name={textName}
                    style={{ marginTop: '0px' }}
                    value={form[textName][count] || ''}
                    onChange={e => {
                      updatePetitionFormValueSequence({
                        index: count,
                        key: e.target.name,
                        value: e.target.value,
                      });
                      deleteValidationErrorMessageSequence({
                        validationKey: [KEY],
                      });
                    }}
                  />
                </div>
                {count > 0 && (
                  <Button
                    link
                    className="reason-button remove-fact-reason-button"
                    icon="times"
                    onClick={() =>
                      removeFactOrReasonSequence({
                        index: count,
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
                  aria-describedby={`${id}-label`}
                  className="usa-textarea"
                  data-testid={id}
                  id={id}
                  name={textName}
                  style={{ marginTop: '0px', width: '100%' }}
                  value={form[textName][count] || ''}
                  onChange={e => {
                    updatePetitionFormValueSequence({
                      index: count,
                      key: e.target.name,
                      value: e.target.value,
                    });
                    deleteValidationErrorMessageSequence({
                      validationKey: [KEY],
                    });
                  }}
                />
              </div>
              {count > 0 && (
                <Button
                  link
                  className="reason-button remove-fact-reason-button"
                  icon="times"
                  onClick={() =>
                    removeFactOrReasonSequence({
                      index: count,
                      key: textName,
                    })
                  }
                >
                  Remove
                </Button>
              )}
            </Mobile>
          </li>
        </div>
      </FormGroup>
    );
  },
);

PetitionFormResponse.displayName = 'PetitionFormResponse';
