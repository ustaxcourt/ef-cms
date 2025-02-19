import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { Select } from '@web-client/ustc-ui/Select/Selects';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import React from 'react';
import { TrialSessionFilters } from 'web-client-public/src/routes/trial-sessions/PublicTrialSessions';

export const PublicTrialSessionsFilters = function ({
  judgeOptions,
  sessionTypeOptions,
  trialCitiesByState,
  trialSessionsFilters,
  setTrialSessionsFilters,
}: {
  judgeOptions: {
    label: string;
    value: { name: string; userId: string };
  }[];
  sessionTypeOptions: Array<{ label: string; value: string }>;
  trialCitiesByState: Array<{
    label: string;
    options: {
      label: string;
      value: string;
    }[];
  }>;
  setTrialSessionsFilters: (filters: TrialSessionFilters) => void;
  trialSessionsFilters: TrialSessionFilters;
}) {
  const PROCEEDING_TYPES = Object.values({
    all: 'All',
    ...TRIAL_SESSION_PROCEEDING_TYPES,
  });

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
          {PROCEEDING_TYPES.map(proceedingType => (
            <div
              className="usa-radio usa-radio__inline padding-right-1"
              key={proceedingType}
            >
              <input
                aria-describedby="proceeding-type-legend"
                checked={trialSessionsFilters.proceedingType === proceedingType}
                className="usa-radio__input"
                id={`${proceedingType}-proceeding`}
                name="proceedingType"
                type="radio"
                value={proceedingType}
                onChange={e => {
                  setTrialSessionsFilters({
                    ...trialSessionsFilters,
                    proceedingType: e.target.value,
                  });
                }}
              />
              <label
                aria-label={proceedingType}
                className="smaller-padding-right usa-radio__label"
                data-testid={`${proceedingType}-proceeding-label`}
                htmlFor={`${proceedingType}-proceeding`}
                id={`${proceedingType}-proceeding-label`}
              >
                {proceedingType}
              </label>
            </div>
          ))}
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
              selectedValues={trialSessionsFilters.sessionTypes}
              onAdd={sessionType => {
                setTrialSessionsFilters({
                  ...trialSessionsFilters,
                  sessionTypes: {
                    ...trialSessionsFilters.sessionTypes,
                    [sessionType]: sessionType,
                  },
                });
              }}
              onRemove={sessionType => {
                const newSelectedSessions = {
                  ...trialSessionsFilters.sessionTypes,
                };
                delete newSelectedSessions[sessionType];

                setTrialSessionsFilters({
                  ...trialSessionsFilters,
                  sessionTypes: newSelectedSessions,
                });
              }}
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
              selectedValues={trialSessionsFilters.locations}
              onAdd={location => {
                setTrialSessionsFilters({
                  ...trialSessionsFilters,
                  locations: {
                    ...trialSessionsFilters.locations,
                    [location]: location,
                  },
                });
              }}
              onRemove={location => {
                const newSelectedLocations = {
                  ...trialSessionsFilters.locations,
                };
                delete newSelectedLocations[location];

                setTrialSessionsFilters({
                  ...trialSessionsFilters,
                  locations: newSelectedLocations,
                });
              }}
            />
          </div>
          <div
            className="desktop:grid-col-4 grid-col-12 tablet:padding-right-2"
            data-testid="judge-filter"
          >
            <FilterSelect
              label="Judge"
              name="judges"
              options={judgeOptions}
              selectedValues={trialSessionsFilters.judges}
              onAdd={judge => {
                setTrialSessionsFilters({
                  ...trialSessionsFilters,
                  judges: {
                    ...trialSessionsFilters.judges,
                    [judge.userId]: judge,
                  },
                });
              }}
              onRemove={judgeUserId => {
                const newSelectedJudges = {
                  ...trialSessionsFilters.judges,
                };
                delete newSelectedJudges[judgeUserId];

                setTrialSessionsFilters({
                  ...trialSessionsFilters,
                  judges: newSelectedJudges,
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

function FilterSelect({
  label,
  name,
  onAdd,
  onRemove,
  options,
  selectedValues,
}: {
  label: string;
  name: string;
  onAdd: (selectedValue) => void;
  onRemove: (selectedValue) => void;
  options:
    | {
        label: string;
        value: string;
      }[]
    | {
        label: string;
        options: {
          label: string;
          value: string;
        }[];
      }[];
  selectedValues: Record<string, any>;
}) {
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
            onChange={option => option && onAdd(option.value)}
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
                onAdd(value);
              }
            }}
          />
        </Phone>
      </div>
      <NonPhone>
        <div className="margin-bottom-1">
          {Object.entries(selectedValues).map(([optionKey, optionLabel]) => (
            <PillButton
              data-testid={`${name}-${optionLabel}-pill-button`}
              key={optionLabel}
              text={optionLabel?.name || optionLabel}
              onRemove={() => {
                onRemove(optionKey);
              }}
            />
          ))}
        </div>
      </NonPhone>
    </>
  );
}
