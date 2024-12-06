import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { SimultaneousMemorandaOfLawFormFields } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const SimultaneousMemorandaOfLawFormFieldset = ({
  onBlurHandler,
  onChangeHandler,
  simultaneousMemorandaOfLawFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  simultaneousMemorandaOfLawFormState: SimultaneousMemorandaOfLawFormFields;
}) => {
  const rowsConfig = [
    { key: 'memoranda', rowLabel: 'Memoranda' },
    { key: 'answering', rowLabel: 'Answering' },
  ];

  return (
    <fieldset className="border-0 grid-container padding-0">
      {rowsConfig.map(rowConfig => {
        return (
          <div
            className="grid-row grid-gap align-items-center margin-bottom-1"
            key={rowConfig.key}
          >
            <div className="grid-col-1">
              <span className="usa-label margin-bottom-0">
                {rowConfig.rowLabel}
              </span>
            </div>
            <div className="grid-col-4">
              <DateSelector
                defaultValue={undefined}
                formGroupClassNames="margin-bottom-0"
                id={`${rowConfig.key}DueDate`}
                label="Date"
                labelPosition="left"
                onChange={e =>
                  onChangeHandler({
                    name: 'briefDetails',
                    rowInfo: {
                      key: rowConfig.key,
                      nestedName: 'dueDate',
                    },
                    section: 'trialBrief',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid-col-7">
              <FormGroup className="margin-bottom-0 display-flex align-items-center">
                <label
                  className="margin-right-2 margin-bottom-0 display-inline-block"
                  htmlFor={`${rowConfig.key}Note`}
                >
                  Note
                </label>
                <input
                  className="usa-input"
                  id={`${rowConfig.key}Note`}
                  name={`${rowConfig.key}Note`}
                  type="text"
                  value={
                    simultaneousMemorandaOfLawFormState[rowConfig.key].note
                  }
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'briefDetails',
                      rowInfo: {
                        key: rowConfig.key,
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
        );
      })}
    </fieldset>
  );
};
