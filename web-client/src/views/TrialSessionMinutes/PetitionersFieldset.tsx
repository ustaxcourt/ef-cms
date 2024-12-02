import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const PetitionersFieldset = ({
  onBlurHandler,
  onChangeHandler,
  petitionersFormState,
}: {
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean;
  }) => void;
  onBlurHandler: () => void;
  petitionersFormState: MinuteSheetFormState['petitioners'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">Petitioner(s)</div>
        <div className="grid-col-5">Date(s) of Appearance</div>
      </div>
      <div className="grid-row grid-gap-4 flex-justify-start align-items-center">
        <div className="grid-col-5">
          <FormGroup className="margin-bottom-0">
            <label hidden htmlFor="petitioner">
              {/* TODO 10419 this should be index of row */}
              {'Petitioner 0'}
            </label>
            <input
              className="usa-input"
              id="petitioner"
              name="petitioner"
              type="text"
              value={petitionersFormState.petitioners[0].name}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  section: 'petitioners',
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-5">
          <DateSelector
            defaultValue={undefined}
            formGroupClassNames="margin-bottom-0 flex-justify-start"
            id="petitioner-date-of-appearance"
            labelPosition="hidden"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: e.target.name,
                section: 'petitioners',
                value: e.target.value,
              })
            }
          />
        </div>
        {/* TODO 10419 make this a functional button */}
        <div className="grid-col-auto">Remove</div>
      </div>
    </fieldset>
  );
};
