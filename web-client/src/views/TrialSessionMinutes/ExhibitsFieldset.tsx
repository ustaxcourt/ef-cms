import {
  AddRowHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import {
  EXHIBIT_STATUS_OPTIONS,
  MinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React from 'react';

export const ExhibitsFieldset = ({
  addRowHandler,
  exhibitsFormState,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  addRowHandler: AddRowHandler;
  exhibitsFormState: MinuteSheetFormState['exhibits'];
  removeRowHandler: RemoveRowHandler;
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap-2">
        <div className="grid-col-5">
          <div className="usa-label margin-right-2">Exhibits</div>
        </div>
        <div className="grid-col-7"></div>
      </div>
      {Object.values(exhibitsFormState.exhibits).map((row, rowIndex) => (
        <div
          className="grid-row grid-gap-2 flex-justify-start align-items-center margin-bottom-1"
          key={row.renderKey}
        >
          <div className="grid-col-5">
            <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
              <label hidden htmlFor={`exhibitDescription${rowIndex}`}>
                {`Description ${rowIndex}`}
              </label>
              <input
                className="usa-input maxw-full"
                id={`exhibitDescription${rowIndex}`}
                name={`exhibitDescription${rowIndex}`}
                type="text"
                value={exhibitsFormState.exhibits[row.renderKey].description}
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'exhibits',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'description',
                    },
                    section: 'exhibits',
                    value: e.target.value,
                  })
                }
              />
            </FormGroup>
          </div>
          <div className="grid-col-2">
            <FormGroup className="margin-bottom-0 display-flex align-items-center">
              <label
                className="margin-right-2 margin-bottom-0 display-inline-block"
                htmlFor={`exhibitStatus${rowIndex}`}
              >
                Type
              </label>
              <select
                className="usa-select display-inline-block"
                id={`exhibitStatus${rowIndex}`}
                name={`exhibitStatus${rowIndex}`}
                value={exhibitsFormState.exhibits[row.renderKey].status}
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'exhibits',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'status',
                    },
                    section: 'exhibits',
                    value: e.target.value,
                  });
                }}
              >
                <option value="">- Select -</option>
                {Object.keys(EXHIBIT_STATUS_OPTIONS).map(optionKey => {
                  return (
                    <option key={optionKey} value={optionKey}>
                      {EXHIBIT_STATUS_OPTIONS[optionKey]}
                    </option>
                  );
                })}
              </select>
            </FormGroup>
          </div>
          <div className="grid-col-3">
            <FormGroup className="margin-bottom-0 display-flex align-items-center">
              <label
                className="margin-right-2 margin-bottom-0 display-inline-block"
                htmlFor={`exhibitNote${rowIndex}`}
              >
                Note
              </label>
              <input
                className="usa-input"
                id={`exhibitNote${rowIndex}`}
                name={`exhibitNote${rowIndex}`}
                type="text"
                value={exhibitsFormState.exhibits[row.renderKey].note}
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'exhibits',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'note',
                    },
                    section: 'exhibits',
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
                  name: 'exhibits',
                  section: 'exhibits',
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
              name: 'exhibits',
              section: 'exhibits',
            });
          }}
        >
          Add Exhibit
        </Button>
      </div>
    </fieldset>
  );
};
