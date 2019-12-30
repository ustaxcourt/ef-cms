import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';

import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const EditPetitionDetails = connect(
  {
    cancelEditPetitionDetailsSequence:
      sequences.cancelEditPetitionDetailsSequence,
    navigateBackSequence: sequences.navigateBackSequence,
  },
  ({ cancelEditPetitionDetailsSequence }) => {
    return (
      <>
        <h3>Edit Petition Details</h3>
        <div className="blue-container">
          <h4>Petition Fee</h4>
          <FormGroup errorText={''}>
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Fee paid?</legend>
              <div className="usa-radio usa-radio__inline" key={'paid'}>
                <input
                  className="usa-radio__input"
                  name="paid"
                  type="radio"
                  value={'Paid'}
                />
                <label className="usa-radio__label" htmlFor={'payment-status'}>
                  Paid
                </label>
              </div>

              <div className="usa-radio usa-radio__inline" key={'Not Paid'}>
                <input
                  className="usa-radio__input"
                  name="not paid"
                  type="radio"
                  value={'Not Paid'}
                />
                <label className="usa-radio__label" htmlFor={'payment-status'}>
                  Not Paid
                </label>
              </div>

              <div className="usa-radio usa-radio__inline" key={'not paid'}>
                <input
                  className="usa-radio__input"
                  name="waived"
                  type="radio"
                  value={'Waived'}
                />
                <label className="usa-radio__label" htmlFor={'payment-status'}>
                  Waived
                </label>
              </div>
            </fieldset>
          </FormGroup>
        </div>

        <Button
          onClick={() => {
            // submitUpdateUserContactInformationSequence();
          }}
        >
          Save
        </Button>
        <Button link onClick={() => cancelEditPetitionDetailsSequence()}>
          Cancel
        </Button>
      </>
    );
  },
);
