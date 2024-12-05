import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const RespondentsFieldset = ({
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
  respondentsFormState,
}: {
  addRowHandler: ({ name, section }: { name: string; section: string }) => void;
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean;
    rowInfo?: { key: string; nestedName: string };
  }) => void;
  onBlurHandler: () => void;
  removeRowHandler: ({
    key,
    name,
    section,
  }: {
    key: string;
    name: string;
    section: string;
  }) => void;
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
      {Object.values(respondentsFormState.respondents).map((row, rowIndex) => {
        return (
          <div
            className="grid-row grid-gap flex-justify-end align-items-center"
            key={`respondent-row-${row.renderKey}`}
          >
            <div className="grid-col-5">
              <FormGroup className="margin-bottom-0">
                <label hidden htmlFor={`respondent-${rowIndex}`}>
                  {/* TODO 10419 this should be index of row */}
                  {`Respondent ${rowIndex}`}
                </label>
                <input
                  className="usa-input"
                  id={`respondent-${rowIndex}`}
                  name={`respondent-${rowIndex}`}
                  type="text"
                  value={respondentsFormState.respondents[row.renderKey].name}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'respondents',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'name',
                      },
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
                id={`respondent-date-of-appearance-${rowIndex}`}
                labelPosition="hidden"
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'respondents',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'datesOfAppearance',
                    },
                    section: 'respondents',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <button
              className="grid-col-auto"
              onClick={e => {
                e.preventDefault();
                removeRowHandler({
                  key: row.renderKey,
                  name: 'respondents',
                  section: 'respondents',
                });
              }}
            >
              <Icon className="icon-class" icon="times" size="1x" />
            </button>
          </div>
        );
      })}
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <Button
          secondary={true}
          onClick={e => {
            e.preventDefault();
            addRowHandler({
              name: 'respondents',
              section: 'respondents',
            });
          }}
        >
          Add Respondent
        </Button>
      </div>
    </fieldset>
  );
};
