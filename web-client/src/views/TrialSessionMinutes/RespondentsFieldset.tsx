import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CreatableSelect } from '@web-client/ustc-ui/Select/CreatableSelect';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  RESPONDENT_ROLE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
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
        <div className="grid-col-3 usa-label">Respondent(s)</div>
        <div className="grid-col-2 usa-label">Role</div>
        <div className="grid-col-3 usa-label">Date(s) of Appearance</div>
        <div className="grid-col-2 usa-label">Note</div>
      </div>
      {Object.values(respondentsFormState.respondents).map((row, rowIndex) => {
        return (
          <div
            className="grid-row grid-gap-2 align-items-center margin-bottom-1"
            key={`respondent-row-${row.renderKey}`}
          >
            <div className="grid-col-3">
              <FormGroup className="margin-bottom-0">
                <CreatableSelect
                  id={`respondent-${rowIndex}`}
                  data-testid={`respondent-${rowIndex}`}
                  aria-label={`respondent-${rowIndex}`}
                  isClearable={true}
                  name={`respondent-selectable-${rowIndex}`}
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
                  onBlur={e => {
                    if (e.target.value) {
                      onChangeHandler({
                        name: 'respondents',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'name',
                        },
                        section:
                          MINUTE_SHEET_FORM_SECTION_MAP.respondentsSection,
                        value: e.target.value,
                      });
                    }
                  }}
                />
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0 display-flex align-items-center">
                <select
                  className="usa-select display-inline-block"
                  id={`respondent-role-${rowIndex}`}
                  name={`respondent-role-${rowIndex}`}
                  aria-label={`respondent-role-${rowIndex}`}
                  value={respondentsFormState.respondents[row.renderKey].role}
                  onBlur={() => onBlurHandler()}
                  onChange={e => {
                    onChangeHandler({
                      name: 'respondents',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'role',
                      },
                      section: MINUTE_SHEET_FORM_SECTION_MAP.respondentsSection,
                      value: e.target.value,
                    });
                  }}
                >
                  <option value="">- Select -</option>
                  {Object.keys(RESPONDENT_ROLE_OPTIONS).map(optionKey => {
                    return (
                      <option key={optionKey} value={optionKey}>
                        {RESPONDENT_ROLE_OPTIONS[optionKey]}
                      </option>
                    );
                  })}
                </select>
              </FormGroup>
            </div>
            <div className="grid-col-3">
              <FormGroup className="margin-bottom-0">
                <input
                  className="usa-input"
                  id={`respondent-date-of-appearance-${rowIndex}`}
                  aria-label={`respondent-date-of-appearance-${rowIndex}`}
                  name={`respondent-date-of-appearance-${rowIndex}`}
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
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0">
                <input
                  className="usa-input"
                  id={`respondents-note-${rowIndex}`}
                  name={`respondents-note-${rowIndex}`}
                  aria-label={`respondents-note-${rowIndex}`}
                  type="text"
                  value={respondentsFormState.respondents[row.renderKey].note}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'respondents',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'note',
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
                id={`remove-respondent-button-${rowIndex}`}
                data-testid={`remove-respondent-button-${rowIndex}`}
                className="padding-0"
                icon="times"
                type="button"
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
          data-testid="add-respondent-button"
          className="padding-0 margin-top-1"
          icon="plus"
          type="button"
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
