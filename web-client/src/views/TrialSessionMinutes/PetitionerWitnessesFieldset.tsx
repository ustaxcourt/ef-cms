import {
  AddRowHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const PetitionerWitnessesFieldset = ({
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
  witnessesFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  addRowHandler: AddRowHandler;
  witnessesFormState: MinuteSheetFormState['witnesses'];
  removeRowHandler: RemoveRowHandler;
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap-2 margin-bottom-1">
        <div className="grid-col-12">Petitioner witness(es)</div>
      </div>
      {Object.values(witnessesFormState.petitionerWitnesses).map(
        (row, rowIndex) => (
          <div
            className="grid-row grid-gap-2 flex-justify-start align-items-center margin-bottom-1"
            key={`petitioner-witness-${row.renderKey}`}
          >
            <div className="grid-col-10 maxw-full">
              <FormGroup className="margin-bottom-0">
                <label hidden htmlFor="petitioner">
                  {`Petitioner Witness ${rowIndex}`}
                </label>
                <input
                  className="usa-input"
                  id="petitioner"
                  name="petitioner"
                  type="text"
                  value={
                    witnessesFormState.petitionerWitnesses[row.renderKey].name
                  }
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'petitionerWitnesses',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'name',
                      },
                      section: 'witnesses',
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <Button
                link
                className="padding-0"
                icon="times"
                onClick={e => {
                  e.preventDefault();
                  removeRowHandler({
                    key: row.renderKey,
                    name: 'petitionerWitnesses',
                    section: 'witnesses',
                  });
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ),
      )}

      <div className="grid-row align-items-center margin-bottom-1">
        <Button
          link
          className="padding-0 margin-top-1"
          icon="plus"
          onClick={e => {
            e.preventDefault();
            addRowHandler({
              name: 'petitionerWitnesses',
              section: 'witnesses',
            });
          }}
        >
          Add Witness for Petitioner
        </Button>
      </div>
    </fieldset>
  );
};
