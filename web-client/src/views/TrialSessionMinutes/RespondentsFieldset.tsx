import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CreatableSelect } from '@web-client/ustc-ui/Select/CreatableSelect';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MINUTE_SHEET_FORM_SECTION_MAP } from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const RespondentsFieldset = ({
  addRowHandler,
  formOptions,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
  respondentsFormState,
}: {
  addRowHandler: AddRowHandler;
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  removeRowHandler: RemoveRowHandler;
  respondentsFormState: MinuteSheetFormState['respondentsSection'];
  formOptions;
}) => {
  return (
    <fieldset className="grid-container border-0 padding-0 margin-top-4">
      <div className="grid-row grid-gap-2 margin-bottom-1">
        <div className="grid-col-3">Respondent(s)</div>
        <div className="grid-col-3">Date(s) of Appearance</div>
        <div className="grid-col-auto"></div>
      </div>
      {Object.values(respondentsFormState.respondents).map((row, rowIndex) => {
        return (
          <div
            className="grid-row grid-gap-2 align-items-center margin-bottom-1"
            key={`respondent-row-${row.renderKey}`}
          >
            <div className="grid-col-3">
              <FormGroup className="margin-bottom-0">
                <label hidden htmlFor={`respondent-${rowIndex}`}>
                  {`Respondent ${rowIndex}`}
                </label>
                <CreatableSelect
                  aria-labelledby={`respondent-label-${rowIndex}"`}
                  id={`respondent-${rowIndex}"`}
                  isClearable={true}
                  name={`respondent-${rowIndex}"`}
                  options={formOptions}
                  value={{
                    label: respondentsFormState.respondents[row.renderKey].name,
                    value: respondentsFormState.respondents[row.renderKey].name,
                  }}
                  onChange={inputValue =>
                    onChangeHandler({
                      name: 'respondents',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'name',
                      },
                      section: MINUTE_SHEET_FORM_SECTION_MAP.respondentsSection,
                      value: inputValue?.value || '',
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-3">
              <FormGroup className="margin-bottom-0">
                <label
                  hidden
                  htmlFor={`respondent-date-of-appearance-${rowIndex}`}
                >
                  Date(s) of Appearance
                </label>
                <input
                  className="usa-input"
                  id={`respondent-date-of-appearance-${rowIndex}`}
                  type="text"
                  value={
                    respondentsFormState.respondents[row.renderKey]
                      .datesOfAppearance || ''
                  }
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
              </FormGroup>
            </div>
            <div className="grid-col-auto">
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
