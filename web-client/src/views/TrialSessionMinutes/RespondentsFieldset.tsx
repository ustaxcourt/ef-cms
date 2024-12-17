import {
  AddRowHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  MinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const RespondentsFieldset = ({
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
  respondentsFormState,
}: {
  addRowHandler: AddRowHandler;
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  removeRowHandler: RemoveRowHandler;
  respondentsFormState: MinuteSheetFormState['respondentsSection'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0 margin-left-4">
      <div className="grid-row grid-gap-2 margin-bottom-1">
        <div className="grid-col-5">Respondent(s)</div>
        <div className="grid-col-7">Date(s) of Appearance</div>
      </div>
      {Object.values(respondentsFormState.respondents).map((row, rowIndex) => {
        return (
          <div
            className="grid-row grid-gap-2 align-items-center margin-bottom-1"
            key={`respondent-row-${row.renderKey}`}
          >
            <div className="grid-col-5">
              <FormGroup className="margin-bottom-0">
                <label hidden htmlFor={`respondent-${rowIndex}`}>
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
                    // TODO 10419 make default object to spread in name and section
                    onChangeHandler({
                      name: 'respondents',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'name',
                      },
                      section: MINUTE_SHEET_FORM_SECTION_MAP.respondentsSection,
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
                    section: MINUTE_SHEET_FORM_SECTION_MAP.respondentsSection,
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid-col-2">
              <Button
                link
                className="padding-0"
                icon="times"
                onClick={e => {
                  e.preventDefault();
                  removeRowHandler({
                    key: row.renderKey,
                    name: 'respondents',
                    section: MINUTE_SHEET_FORM_SECTION_MAP.respondentsSection,
                  });
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <div className="grid-row align-items-center margin-bottom-1">
        <Button
          link
          className="padding-0 margin-top-1"
          icon="plus"
          onClick={e => {
            e.preventDefault();
            addRowHandler({
              name: 'respondents',
              section: MINUTE_SHEET_FORM_SECTION_MAP.respondentsSection,
            });
          }}
        >
          Add Respondent
        </Button>
      </div>
    </fieldset>
  );
};
