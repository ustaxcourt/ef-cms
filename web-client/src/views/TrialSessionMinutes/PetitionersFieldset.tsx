import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const PetitionersFieldset = ({
  addPetitionerRowHandler,
  onBlurHandler,
  onChangeHandler,
  petitionersFormState,
  removePetitionerRowHandler,
}: {
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean | object;
  }) => void;
  onBlurHandler: () => void;
  addPetitionerRowHandler: () => void;
  petitionersFormState: MinuteSheetFormState['petitioners'];
  removePetitionerRowHandler: ({ renderKey }: { renderKey: string }) => void;
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
      {petitionersFormState.petitioners.map((row, rowIndex) => (
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
                  value={petitionersFormState.petitioners[rowIndex]?.name}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'petitioners',
                      section: 'petitioners',
                      value: petitionersFormState.petitioners.map(
                        (item, index) =>
                          index === rowIndex
                            ? { ...item, name: e.target.value }
                            : item,
                      ),
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0">
                <label hidden htmlFor="petitionerRole">
                  {`Petitioner Role ${rowIndex}`}
                </label>
                <input
                  className="usa-input"
                  id="petitionerRole"
                  name="petitionerRole"
                  type="text"
                  value={petitionersFormState.petitioners[rowIndex]?.role}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'petitioners',
                      section: 'petitioners',
                      value: petitionersFormState.petitioners.map(
                        (item, index) =>
                          index === rowIndex
                            ? { ...item, role: e.target.value }
                            : item,
                      ),
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-4">
              <FormGroup className="margin-bottom-0">
                <label hidden htmlFor="petitionerDatesOfAppearance">
                  {`Petitioner Role ${rowIndex}`}
                </label>
                <input
                  className="usa-input"
                  id="petitionerDatesOfAppearance"
                  name="petitionerDatesOfAppearance"
                  type="text"
                  value={
                    petitionersFormState.petitioners[rowIndex]
                      ?.datesOfAppearance
                  }
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'petitioners',
                      section: 'petitioners',
                      value: petitionersFormState.petitioners.map(
                        (item, index) =>
                          index === rowIndex
                            ? { ...item, datesOfAppearance: e.target.value }
                            : item,
                      ),
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
                  removePetitionerRowHandler({ renderKey: row.renderKey });
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
              addPetitionerRowHandler();
            }}
          >
            Add Person
          </Button>
        )}
      </div>
    </fieldset>
  );
};
