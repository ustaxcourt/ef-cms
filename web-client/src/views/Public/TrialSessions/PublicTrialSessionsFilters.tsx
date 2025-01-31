import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import {
  PUBLIC_TRIAL_SESSIONS_DATA_KEY,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { Select } from '@web-client/ustc-ui/Select/Selects';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import React from 'react';

type PublicTrialSessionsFiltersProps = {
  judges: { [key: string]: string };
  locations: { [key: string]: string };
  sessionTypes: { [key: string]: string };
  proceedingType: string;
  displayProgressSpinnerSequence: (props: { timeInSeconds: number }) => void;
  updateFormValueSequence: (props: {
    index?: number;
    root?: string;
    key: string;
    value: any;
    allowEmptyString?: boolean;
  }) => void;
  sessionTypeOptions: Array<{ label: string; value: string }>;
  trialCitiesByState: Array<{
    label: string;
    options: {
      label: string;
      value: string;
    }[];
  }>;
  trialSessionJudgeOptions: Array<{ label: string; value: string }>;
};

export const PublicTrialSessionsFilters = function ({
  displayProgressSpinnerSequence,
  judges,
  locations,
  proceedingType,
  sessionTypeOptions,
  sessionTypes,
  trialCitiesByState,
  trialSessionJudgeOptions,
  updateFormValueSequence,
}: PublicTrialSessionsFiltersProps) {
  const PROCEEDING_TYPES = Object.entries({
    all: 'All',
    ...TRIAL_SESSION_PROCEEDING_TYPES,
  });

  const handleUpdateFormValue = (key: string, value: string | undefined) => {
    displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
    updateFormValueSequence({
      key,
      root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
      value,
    });
    updateFormValueSequence({
      key: 'pageNumber',
      root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
      value: 0,
    });
  };

  function proceedingTypeRadioOption(key: string, value: string) {
    return (
      <div className="usa-radio usa-radio__inline padding-right-1" key={key}>
        <input
          aria-describedby="proceeding-type-legend"
          checked={proceedingType === value}
          className="usa-radio__input"
          id={`${key}-proceeding`}
          name="proceedingType"
          type="radio"
          value={value}
          onChange={e => {
            handleUpdateFormValue(e.target.name, e.target.value);
          }}
        />
        <label
          aria-label={value}
          className="smaller-padding-right usa-radio__label"
          data-testid={`${value}-proceeding-label`}
          htmlFor={`${key}-proceeding`}
          id={`${key}-proceeding-label`}
        >
          {value}
        </label>
      </div>
    );
  }

  return (
    <>
      <FormGroup>
        <fieldset
          className="usa-fieldset margin-top-2"
          data-testid="proceeding-type-filter"
        >
          <legend className="usa-legend" id="proceeding-type-legend">
            Proceeding type
          </legend>
          {PROCEEDING_TYPES.map(([key, value]) =>
            proceedingTypeRadioOption(key, value),
          )}
        </fieldset>
      </FormGroup>

      <div className="desktop:grid-col grid-col-12">
        <div className="grid-row">
          <div
            className="desktop:grid-col-4 grid-col-12 tablet:padding-right-2"
            data-testid="session-type-filter"
          >
            <FilterSelect
              label="Session type"
              name="sessionTypes"
              options={sessionTypeOptions}
              selectedValues={sessionTypes}
              onChange={handleUpdateFormValue}
            />
          </div>
          <div
            className="desktop:grid-col-4 grid-col-12 tablet:padding-right-2"
            data-testid="location-filter"
          >
            <FilterSelect
              label="Location"
              name="locations"
              options={trialCitiesByState}
              selectedValues={locations}
              onChange={handleUpdateFormValue}
            />
          </div>
          <div
            className="desktop:grid-col-4 grid-col-12 tablet:padding-right-2"
            data-testid="judge-filter"
          >
            <FilterSelect
              label="Judge"
              name="judges"
              options={trialSessionJudgeOptions}
              selectedValues={judges}
              onChange={handleUpdateFormValue}
            />
          </div>
        </div>
      </div>
    </>
  );
};

function FilterSelect({ label, name, onChange, options, selectedValues }) {
  return (
    <>
      <div className="margin-bottom-2">
        <label className="usa-label" htmlFor={`${name}-filter`}>
          {label} <span className="optional-light-text">(optional)</span>
        </label>
        <NonPhone>
          <SelectSearch
            aria-labelledby={`${name}-filter-label`}
            data-testid={`${name}-filter-select`}
            inputId={`${name}-filter`}
            name={name}
            options={options}
            placeholder="- Select one or more -"
            value={{
              label: '- Select one or more -',
              value: '',
            }}
            onChange={option =>
              option && onChange(`${name}.${option.value}`, option.label)
            }
          />{' '}
        </NonPhone>
        <Phone>
          <Select
            defaultValue={{
              label: '- Select one or more -',
              value: '',
            }}
            name={name}
            options={options}
            value={'- Select one or more -'}
            onChange={value => {
              if (value) {
                onChange(`${name}.${value}`, value);
              }
            }}
          />
        </Phone>
      </div>
      <NonPhone>
        <div className="margin-bottom-1">
          {Object.entries(
            selectedValues as {
              [key: string]: string;
            },
          ).map(([optionKey, optionLabel]) => (
            <PillButton
              data-testid={`${name}-${optionLabel}-pill-button`}
              key={optionLabel}
              text={optionLabel}
              onRemove={() => {
                onChange(`${name}.${optionKey}`, undefined);
              }}
            />
          ))}
        </div>
      </NonPhone>
    </>
  );
}
