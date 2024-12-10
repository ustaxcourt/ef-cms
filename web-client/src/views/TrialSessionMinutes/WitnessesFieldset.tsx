import {
  AddRowHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  WitnessesRecord,
  witnessTypeOptions,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { capitalize } from 'lodash';
import React from 'react';

export const WitnessesFieldset = ({
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
  witnessesFormState,
  witnessType,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  addRowHandler: AddRowHandler;
  witnessesFormState: WitnessesRecord<typeof witnessTypeOptions>;
  witnessType: string;
  removeRowHandler: RemoveRowHandler;
}) => {
  const capitalizedWitnessType = capitalize(witnessType);
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap-2">
        <div className="grid-col-12">
          <div className="usa-label margin-right-2">{`${capitalizedWitnessType} witness(es)`}</div>
        </div>
      </div>
      {Object.values(witnessesFormState).map((row, rowIndex) => (
        <div
          className="grid-row grid-gap-2 flex-justify-start align-items-center margin-bottom-1"
          key={`${witnessType}-witness-${row.renderKey}`}
        >
          <div className="grid-col-10 maxw-full">
            <FormGroup className="margin-bottom-0">
              <label hidden htmlFor={`${witnessType}`}>
                {`${capitalizedWitnessType} Witness ${rowIndex}`}
              </label>
              <input
                className="usa-input"
                id={`${witnessType}`}
                name={`${witnessType}`}
                type="text"
                value={witnessesFormState[row.renderKey].name}
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: `${witnessType}Witnesses`,
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
                  name: `${witnessType}Witnesses`,
                  section: 'witnesses',
                });
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <div className="grid-row align-items-center margin-bottom-1">
        <Button
          link
          className="padding-0 margin-top-1"
          icon="plus"
          onClick={e => {
            e.preventDefault();
            addRowHandler({
              name: `${witnessType}Witnesses`,
              section: 'witnesses',
            });
          }}
        >
          {`Add Witness for ${capitalizedWitnessType}`}
        </Button>
      </div>
    </fieldset>
  );
};
