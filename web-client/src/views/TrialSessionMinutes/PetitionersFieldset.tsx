import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  PETITIONER_ROLE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';
import { invert } from 'lodash';

export const PetitionersFieldset = ({
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  petitionersFormState,
  removeRowHandler,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  addRowHandler: AddRowHandler;
  petitionersFormState: MinuteSheetFormState['petitionersSection'];
  removeRowHandler: RemoveRowHandler;
}) => {
  const SHOW_ROLE_NOTE_ROLE_TYPE = invert(PETITIONER_ROLE_OPTIONS)[
    PETITIONER_ROLE_OPTIONS.other
  ];

  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="grid-row grid-gap-2 margin-bottom-1">
        <div className="grid-col-1 usa-label">Petitioner(s)</div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-inline-block">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={petitionersFormState.noAppearance}
                className="usa-checkbox__input"
                id="noAppearance"
                name="noAppearance"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'noAppearance',
                    section: MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection,
                    value: e.target.checked,
                  })
                }
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="noAppearance"
              >
                No appearance
              </label>
            </div>
          </FormGroup>
        </div>
        <div className="grid-col-2 usa-label">Role</div>
        <div className="grid-col-3 usa-label">Date(s) of Appearance</div>
        <div className="grid-col-4"></div>
      </div>
      {Object.values(petitionersFormState.petitioners).map((row, rowIndex) => (
        <div
          className="grid-row grid-gap-2 flex-justify-start align-items-center margin-bottom-1"
          key={row.renderKey}
        >
          <div className="grid-col-3">
            <FormGroup className="margin-bottom-0">
              <input
                className="usa-input"
                id={`petitioner-${rowIndex}`}
                name={`petitioner-${rowIndex}`}
                aria-label={`petitioner-${rowIndex}`}
                type="text"
                value={petitionersFormState.petitioners[row.renderKey].name}
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'petitioners',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'name',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection,
                    value: e.target.value,
                  })
                }
              />
            </FormGroup>
          </div>
          <div className="grid-col-2">
            <FormGroup className="margin-bottom-0 display-flex align-items-center">
              <select
                className="usa-select display-inline-block"
                id={`petitionerRole-${rowIndex}`}
                name={`petitionerRole-${rowIndex}`}
                aria-label={`petitionerRole-${rowIndex}`}
                value={petitionersFormState.petitioners[row.renderKey].role}
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'petitioners',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'role',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection,
                    value: e.target.value,
                  });
                }}
              >
                <option value="">- Select -</option>
                {Object.keys(PETITIONER_ROLE_OPTIONS).map(optionKey => {
                  return (
                    <option key={optionKey} value={optionKey}>
                      {PETITIONER_ROLE_OPTIONS[optionKey]}
                    </option>
                  );
                })}
              </select>
            </FormGroup>
          </div>
          {petitionersFormState.petitioners[row.renderKey].role ===
            SHOW_ROLE_NOTE_ROLE_TYPE && (
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0">
                <input
                  className="usa-input"
                  id={`petitioner-role-note-${rowIndex}`}
                  name={`petitioner-role-note-${rowIndex}`}
                  aria-label={`petitioner-role-note-${rowIndex}`}
                  type="text"
                  value={
                    petitionersFormState.petitioners[row.renderKey].roleNote
                  }
                  placeholder="Role note"
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'petitioners',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'roleNote',
                      },
                      section: MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection,
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
          )}
          <div className="grid-col-3">
            <FormGroup className="margin-bottom-0">
              <input
                className="usa-input"
                id={`petitioner-dates-of-appearance-${rowIndex}`}
                name={`petitioner-dates-of-appearance-${rowIndex}`}
                aria-label={`petitioner-dates-of-appearance-${rowIndex}`}
                type="text"
                value={
                  petitionersFormState.petitioners[row.renderKey]
                    .datesOfAppearance
                }
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'petitioners',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'datesOfAppearance',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection,
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
                  name: 'petitioners',
                  section: MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection,
                });
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <div className="grid-row align-items-center margin-bottom-1">
        {!petitionersFormState.noAppearance && (
          <Button
            link
            className="padding-0 margin-top-1"
            icon="plus"
            onClick={e => {
              e.preventDefault();
              addRowHandler({
                name: 'petitioners',
                section: MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection,
              });
            }}
          >
            Add Person
          </Button>
        )}
      </div>
    </fieldset>
  );
};
