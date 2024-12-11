import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { SimultaneousBriefFormFields } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const SimultaneousBriefFormFieldset = ({
  onBlurHandler,
  onChangeHandler,
  simultaneousBriefFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  simultaneousBriefFormState: SimultaneousBriefFormFields;
}) => {
  const rowsConfig = [
    { key: 'opening', rowLabel: 'Opening' },
    { key: 'answering', rowLabel: 'Answering' },
    { key: 'reply', rowLabel: 'Reply' },
    { key: 'surReply', rowLabel: 'Sur-reply' },
  ];

  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap align-items-center">
        <div className="grid-col-1"></div>
        <div className="grid-col-4">
          <span className="usa-label">Date due</span>
        </div>
        <div className="grid-col-7">
          <span className="usa-label">Note</span>
        </div>
      </div>
      {rowsConfig.map(rowConfig => {
        return (
          <div
            className="grid-row grid-gap align-items-center margin-bottom-1"
            key={rowConfig.key}
          >
            <div className="grid-col-1">
              <span>{rowConfig.rowLabel}</span>
            </div>
            <div className="grid-col-4">
              <DateSelector
                defaultValue={undefined}
                formGroupClassNames="margin-bottom-0"
                id={`${rowConfig.key}DueDate`}
                labelPosition="hidden"
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
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full padding-right-4">
                <label hidden htmlFor={`${rowConfig.key}Note`}>
                  Note
                </label>
                <input
                  className="usa-input maxw-full"
                  id={`${rowConfig.key}Note`}
                  name={`${rowConfig.key}Note`}
                  type="text"
                  value={simultaneousBriefFormState[rowConfig.key].note}
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
