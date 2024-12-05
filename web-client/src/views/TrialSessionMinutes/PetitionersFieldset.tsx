import {
  AddRowHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
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
  petitionersFormState: MinuteSheetFormState['petitioners'];
  removeRowHandler: RemoveRowHandler;
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row">
        <div className="grid-col-2">Petitioner(s)</div>
        <div className="grid-col-3">
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
                  section: 'petitioners',
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
        <div className="grid-col-5">Date(s) of Appearance</div>
      </div>
      {Object.values(petitionersFormState.petitioners).map((row, rowIndex) => (
        <div className="margin-bottom-1" key={row.renderKey}>
          <div className="grid-row grid-gap-2 flex-justify-start align-items-center">
            <div className="grid-col-5">
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
                      section: 'petitioners',
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0">
                <label hidden htmlFor={`petitionerRole-${rowIndex}`}>
                  {`Petitioner Role ${rowIndex}`}
                </label>
                <input
                  className="usa-input"
                  id={`petitionerRole-${rowIndex}`}
                  name={`petitionerRole-${rowIndex}`}
                  type="text"
                  value={petitionersFormState.petitioners[row.renderKey].role}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'petitioners',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'role',
                      },
                      section: 'petitioners',
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-4">
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
                      section: 'petitioners',
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-1">
              <button
                className="grid-col-auto"
                onClick={e => {
                  e.preventDefault();
                  removeRowHandler({
                    key: row.renderKey,
                    name: 'petitioners',
                    section: 'petitioners',
                  });
                }}
              >
                <Icon className="icon-class" icon="times" size="1x" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        {!petitionersFormState.noAppearance && (
          <Button
            secondary={true}
            onClick={e => {
              e.preventDefault();
              addRowHandler({
                name: 'petitioners',
                section: 'petitioners',
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
