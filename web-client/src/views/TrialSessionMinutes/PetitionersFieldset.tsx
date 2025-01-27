import {
  AddRowHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  MinuteSheetFormState,
  PETITIONER_ROLE_OPTIONS,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const PetitionersFieldset = ({
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  petitionersFormState,
  removeRowHandler,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  addRowHandler: AddRowHandler;
  petitionersFormState: MinuteSheetFormState['petitionersSection'];
  removeRowHandler: RemoveRowHandler;
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap-2 margin-bottom-1">
        <div className="grid-col-1">Petitioner(s)</div>
        <div className="grid-col-2">
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
        </div>
        <div className="grid-col-2">Role</div>
        <div className="grid-col-3">Date(s) of Appearance</div>
        <div className="grid-col-4"></div>
      </div>
      {Object.values(petitionersFormState.petitioners).map((row, rowIndex) => (
        <div
          className="grid-row grid-gap-2 flex-justify-start align-items-center margin-bottom-1"
          key={row.renderKey}
        >
          <div className="grid-col-3">
            <FormGroup className="margin-bottom-0">
              <label hidden htmlFor="petitioner">
                {`Petitioner ${rowIndex}`}
              </label>
              <input
                className="usa-input"
                id="petitioner"
                name="petitioner"
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
              <label hidden htmlFor={`petitionerRole-${rowIndex}`}>
                Role
              </label>
              <select
                className="usa-select display-inline-block"
                id={`petitionerRole-${rowIndex}`}
                name={`petitionerRole-${rowIndex}`}
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
          <div className="grid-col-3">
            <FormGroup className="margin-bottom-0">
              <label
                hidden
                htmlFor={`petitioner-dates-of-appearance-${rowIndex}`}
              >
                {`Petitioner Role ${rowIndex}`}
              </label>
              <input
                className="usa-input"
                id={`petitioner-dates-of-appearance-${rowIndex}`}
                name={`petitioner-dates-of-appearance-${rowIndex}`}
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
          <div className="grid-col-4">
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
