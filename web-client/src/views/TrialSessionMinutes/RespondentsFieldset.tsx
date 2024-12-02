import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const RespondentsFieldset = ({
  onBlurHandler,
  onChangeHandler,
  respondentsFormState,
}: {
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean;
  }) => void;
  onBlurHandler: () => void;
  respondentsFormState: MinuteSheetFormState['respondents'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap-4 flex-justify-end">
        <div className="grid-col-5">Respondent(s)</div>
        <div className="grid-col-5">Date(s) of Appearance</div>
        {/* TODO 10419 We need to get rid of this, but keeping it in for now to demonstrate the desired alignment */}
        <div className="grid-col-auto">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <div className="grid-row grid-gap flex-justify-end align-items-center">
        <div className="grid-col-5">
          <FormGroup className="margin-bottom-0">
            <label hidden htmlFor="respondent">
              {/* TODO 10419 this should be index of row */}
              {'Respondent 0'}
            </label>
            <input
              className="usa-input"
              id="respondent"
              name="respondent"
              type="text"
              value={respondentsFormState[0].name}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  section: 'respondents',
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-5">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0"
            id="respondent-date-of-appearance"
            labelPosition="hidden"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: e.target.name,
                section: 'respondents',
                value: e.target.value,
              })
            }
          />
        </div>
        {/* TODO 10419 make this a functional button */}
        <div className="grid-col-auto">Remove</div>
      </div>
    </fieldset>
  );
};
