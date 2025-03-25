import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  BRIEF_SUBTYPE,
  MINUTE_SHEET_FORM_SECTION_MAP,
} from '@shared/business/entities/EntityConstants';
import {
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';
import { SimultaneousMemorandaOfLaw } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const SimultaneousMemorandaOfLawFormFieldset = ({
  onBlurHandler,
  onChangeHandler,
  simultaneousMemorandaOfLawFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  simultaneousMemorandaOfLawFormState: SimultaneousMemorandaOfLaw;
}) => {
  const rowsConfig = [
    { key: 'memoranda', rowLabel: BRIEF_SUBTYPE.memoranda },
    { key: 'answering', rowLabel: BRIEF_SUBTYPE.answering },
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
      {rowsConfig.map((rowConfig, index) => {
        return (
          <div
            className="grid-row grid-gap align-items-center margin-bottom-1"
            key={rowConfig.key}
          >
            <div className="grid-col-1">
              <span>{rowConfig.rowLabel}</span>
            </div>
            <div className="grid-col-4">
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                <input
                  className="usa-input display-inline-block maxw-full"
                  aria-label={`${rowConfig.key}DueDate`}
                  id={`${rowConfig.key}DueDate`}
                  data-testid={`${rowConfig.key}DueDate`}
                  name={`${rowConfig.key}DueDate`}
                  type="text"
                  value={
                    simultaneousMemorandaOfLawFormState[rowConfig.key].dueDate
                  }
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'briefDetails',
                      rowInfo: {
                        key: rowConfig.key,
                        nestedName: 'dueDate',
                      },
                      section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-7">
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                <input
                  className="usa-input maxw-full"
                  id={`${rowConfig.key}Note`}
                  aria-label={`Note-${index}`}
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
                      section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
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
