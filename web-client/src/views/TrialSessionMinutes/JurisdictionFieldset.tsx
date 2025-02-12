import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MINUTE_SHEET_FORM_SECTION_MAP } from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';

export const JurisdictionFieldset = ({
  jurisdictionFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  jurisdictionFormState: MinuteSheetFormState['jurisdictionSection'];
}) => {
  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="grid-row grid-gap-2 align-items-center margin-bottom-1">
        <legend className="usa-legend grid-col-2 margin-bottom-0">
          Jurisdiction Retained
        </legend>
        <div className="grid-col-auto">
          <DateSelector
            formatDateOnChange
            defaultValue={jurisdictionFormState.retained.date}
            formGroupClassNames="margin-bottom-0"
            id="jurisdictionRetainedDate"
            label="Date"
            labelPosition="left"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: 'retained',
                rowInfo: {
                  key: 'date',
                },
                section: MINUTE_SHEET_FORM_SECTION_MAP.jurisdictionSection,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-fill">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="jurisdictionRetainedNote"
            >
              Note
            </label>
            <input
              className="usa-input maxw-full"
              id="jurisdictionRetainedNote"
              name="jurisdictionRetainedNote"
              aria-labelledby="jurisdictionRetainedNote"
              type="text"
              value={jurisdictionFormState.retained.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'retained',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.jurisdictionSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap-2 align-items-center">
        <legend className="usa-legend grid-col-2 margin-bottom-0">
          Continued
        </legend>
        <div className="grid-col-auto">
          <DateSelector
            formatDateOnChange
            defaultValue={jurisdictionFormState.continued.date}
            formGroupClassNames="margin-bottom-0"
            id="jurisdictionContinuedDate"
            label="Date"
            labelPosition="left"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: 'continued',
                rowInfo: {
                  key: 'date',
                },
                section: MINUTE_SHEET_FORM_SECTION_MAP.jurisdictionSection,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-fill">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="continuedNote"
            >
              Note
            </label>
            <input
              className="usa-input maxw-full"
              id="continuedNote"
              name="continuedNote"
              type="text"
              value={jurisdictionFormState.continued.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'continued',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.jurisdictionSection,
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
