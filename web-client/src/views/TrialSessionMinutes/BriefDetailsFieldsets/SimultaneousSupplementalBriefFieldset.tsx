import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { SimultaneousSupplementalFormFields } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const SimultaneousSupplementalBriefFieldset = ({
  onBlurHandler,
  onChangeHandler,
  simultaneousSupplementalBriefFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  simultaneousSupplementalBriefFormState: SimultaneousSupplementalFormFields;
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap align-items-center">
        <div className="grid-col-4">
          <span className="usa-label">Date due</span>
        </div>
        <div className="grid-col-8">
          <span className="usa-label">Note</span>
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="simultaneousSupplementalDueDate"
            labelPosition="hidden"
            onChange={e =>
              onChangeHandler({
                name: 'briefDetails',
                rowInfo: {
                  key: 'simultaneousSupplemental',
                  nestedName: 'dueDate',
                },
                section: 'trialBrief',
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-8">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <label hidden htmlFor="simultaneousSupplementalNote">
              Note
            </label>
            <input
              className="usa-input"
              id="simultaneousSupplementalNote"
              name="simultaneousSupplementalNote"
              type="text"
              value={
                simultaneousSupplementalBriefFormState.simultaneousSupplemental
                  .note
              }
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'briefDetails',
                  rowInfo: {
                    key: 'simultaneousSupplemental',
                    nestedName: 'note',
                  },
                  section: 'trialBrief',
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
      </div>
    </fieldset>
  );
};
