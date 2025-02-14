import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MINUTE_SHEET_FORM_SECTION_MAP } from '@shared/business/entities/EntityConstants';
import {
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';
import { SimultaneousSupplemental } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const SimultaneousSupplementalBriefFieldset = ({
  onBlurHandler,
  onChangeHandler,
  simultaneousSupplementalBriefFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  simultaneousSupplementalBriefFormState: SimultaneousSupplemental;
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
            formatDateOnChange
            defaultValue={
              simultaneousSupplementalBriefFormState.simultaneousSupplemental
                .dueDate
            }
            formGroupClassNames="margin-bottom-0"
            id="simultaneousSupplementalDueDate"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: 'briefDetails',
                rowInfo: {
                  key: 'simultaneousSupplemental',
                  nestedName: 'dueDate',
                },
                section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-8">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <input
              className="usa-input maxw-full"
              id="simultaneousSupplementalNote"
              aria-label="simultaneousSupplementalNote"
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
                  section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
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
