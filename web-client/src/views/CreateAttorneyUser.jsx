import { Button } from '../ustc-ui/Button/Button';
import { UserContactEditForm } from './UserContactEditForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateAttorneyUser = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
    submitCreateAttorneyUserSequence:
      sequences.submitCreateAttorneyUserSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    navigateBackSequence,
    submitCreateAttorneyUserSequence,
    updateFormValueSequence,
  }) => {
    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="grid-col-12">
              <UserContactEditForm
                bind="form"
                type="contact"
                updateSequence={updateFormValueSequence}
                validateSequence={() => null}
                onBlurSequence={() => null}
              />

              <Button
                onClick={() => {
                  submitCreateAttorneyUserSequence();
                }}
              >
                Save
              </Button>
              <Button link onClick={() => navigateBackSequence()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  },
);
