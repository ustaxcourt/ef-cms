import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const OtherStatisticsForm = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function OtherStatisticsForm({ form, updateFormValueSequence }) {
    return (
      <div className="grid-row grid-gap-6">
        <div className="grid-col-2">
          <FormGroup>
            <label className="usa-label" htmlFor="litigation-costs">
              Litigation costs
            </label>
            <DollarsInput
              className="usa-input usa-input-inline"
              id="litigation-costs"
              name="litigationCosts"
              value={form.litigationCosts || ''}
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
            <label className="usa-label" htmlFor="damages">
              Damages (IRC §6673)
            </label>
            <DollarsInput
              className="usa-input usa-input-inline"
              id="damages"
              name="damages"
              value={form.damages || ''}
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
    );
  },
);

OtherStatisticsForm.displayName = 'OtherStatisticsForm';
