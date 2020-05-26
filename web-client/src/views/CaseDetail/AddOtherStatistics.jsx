import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddOtherStatistics = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function AddOtherStatistics({ form, updateFormValueSequence }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-1" />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <h1>Add Other Statistics</h1>

          <div className="blue-container margin-bottom-5">
            <div className="grid-row grid-gap-6">
              <div className="grid-col-2">
                <FormGroup>
                  <label className="usa-label" htmlFor={'litigation-costs'}>
                    Litigation costs
                  </label>
                  <DollarsInput
                    className="usa-input usa-input-inline"
                    id={'litigation-costs'}
                    name={'litigationCosts'}
                    value={form.litigationCosts || ''}
                    // onBlur={() => validatePetitionFromPaperSequence()}
                    onValueChange={values => {
                      updateFormValueSequence({
                        key: 'litigationCosts',
                        value: values.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>

              <div className="grid-col-2">
                <FormGroup>
                  <label className="usa-label" htmlFor={'damages'}>
                    Damages (IRC §6673)
                  </label>
                  <DollarsInput
                    className="usa-input usa-input-inline"
                    id={'damages'}
                    name={'damages'}
                    value={form.damages || ''}
                    // onBlur={() => validatePetitionFromPaperSequence()}
                    onValueChange={values => {
                      updateFormValueSequence({
                        key: 'damages',
                        value: values.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>
          </div>

          <div className="margin-top-3">
            <Button onClick={() => {}}>Save</Button>

            <Button link onClick={() => {}}>
              Cancel
            </Button>
          </div>
        </section>
      </>
    );
  },
);
