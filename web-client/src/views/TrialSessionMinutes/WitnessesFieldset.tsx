import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MINUTE_SHEET_FORM_SECTION_MAP } from '@shared/business/entities/EntityConstants';
import {
  WitnessesRecord,
  WitnessTypeOption,
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
  onBlurHandler: AutoSaveHandler;
  addRowHandler: AddRowHandler;
  witnessesFormState: WitnessesRecord<WitnessTypeOption>;
  witnessType: string;
  removeRowHandler: RemoveRowHandler;
}) => {
  const capitalizedWitnessType = capitalize(witnessType);
  return (
    <fieldset className="grid-container border-0 padding-0">
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
          <div className="grid-col-10">
            <FormGroup className="margin-bottom-0 maxw-full">
              <input
                className="usa-input maxw-full"
                id={`witnessType-${rowIndex}`}
                name={`witnessType-${rowIndex}`}
                aria-label={`witnessType-${rowIndex}`}
                data-testid={`${witnessType}-witness-input-${rowIndex}`}
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
                    section: MINUTE_SHEET_FORM_SECTION_MAP.witnessesSection,
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
              data-testid={`remove-${witnessType}-witness-button-${rowIndex}`}
              icon="times"
              type="button"
              onClick={e => {
                e.preventDefault();
                removeRowHandler({
                  key: row.renderKey,
                  name: `${witnessType}Witnesses`,
                  section: MINUTE_SHEET_FORM_SECTION_MAP.witnessesSection,
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
          data-testid={`add-${witnessType}-witness-button`}
          className="padding-0 margin-top-1"
          icon="plus"
          type="button"
          onClick={e => {
            e.preventDefault();
            addRowHandler({
              name: `${witnessType}Witnesses`,
              section: MINUTE_SHEET_FORM_SECTION_MAP.witnessesSection,
            });
          }}
        >
          {`Add Witness for ${capitalizedWitnessType}`}
        </Button>
      </div>
    </fieldset>
  );
};
