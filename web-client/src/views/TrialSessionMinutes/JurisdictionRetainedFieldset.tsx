import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  MinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';

export const JurisdictionRetainedFieldset = ({
  jurisdictionRetainedFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  jurisdictionRetainedFormState: MinuteSheetFormState['jurisdictionRetainedSection'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap align-items-center">
        <legend className="usa-legend grid-col-auto margin-bottom-0">
          Jurisdiction Retained
        </legend>
        <div className="grid-col-1">
          <FormGroup className="margin-bottom-0">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={jurisdictionRetainedFormState.continued}
                className="usa-checkbox__input"
                id="jurisdictionRetainedContinued"
                name="jurisdictionRetainedContinued"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'continued',
                    section:
                      MINUTE_SHEET_FORM_SECTION_MAP.jurisdictionRetainedSection,
                    value: e.target.checked,
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="jurisdictionRetainedContinued"
              >
                Continued
              </label>
            </div>
          </FormGroup>
        </div>
        <div className="grid-col-auto">
          <DateSelector
            formatDateOnChange
            defaultValue={jurisdictionRetainedFormState.date}
            formGroupClassNames="margin-bottom-0"
            id="jurisdictionRetainedDate"
            label="Date"
            labelPosition="left"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: 'date',
                section:
                  MINUTE_SHEET_FORM_SECTION_MAP.jurisdictionRetainedSection,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-fill">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor={'$jurisdictionRetainedNote'}
            >
              Note
            </label>
            <input
              className="usa-input maxw-full"
              id="jurisdictionRetainedNote"
              name="jurisdictionRetainedNote"
              type="text"
              value={jurisdictionRetainedFormState.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'note',
                  section:
                    MINUTE_SHEET_FORM_SECTION_MAP.jurisdictionRetainedSection,
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
