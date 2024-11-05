import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { Select } from '@web-client/ustc-ui/Select/Selects';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

type PublicTrialSessionsFiltersProps = {
  ROOT: string;
};

const props = cerebralProps as unknown as PublicTrialSessionsFiltersProps;

const PublicTrialSessionsFiltersDeps = {
  displayProgressSpinnerSequence: sequences.displayProgressSpinnerSequence,
  publicTrialSessionData: state[props.ROOT],
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
  updateFormValueSequence: sequences.updateFormValueSequence,
};

export const PublicTrialSessionsFilters = connect<
  PublicTrialSessionsFiltersProps,
  typeof PublicTrialSessionsFiltersDeps
>(
  PublicTrialSessionsFiltersDeps,
  function ({
    displayProgressSpinnerSequence,
    publicTrialSessionData,
    publicTrialSessionsHelper,
    ROOT,
    updateFormValueSequence,
  }) {
    const PROCEEDING_TYPES = Object.entries({
      all: 'All',
      ...TRIAL_SESSION_PROCEEDING_TYPES,
    });

    const {
      judges = {},
      locations = {},
      proceedingType = 'All',
      sessionTypes = {},
    } = publicTrialSessionData;

    const handleUpdateFormValue = (key: string, value: string | undefined) => {
      displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
      updateFormValueSequence({ key, root: ROOT, value });
      updateFormValueSequence({
        key: 'pageNumber',
        root: ROOT,
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
                options={publicTrialSessionsHelper.sessionTypeOptions}
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
                options={publicTrialSessionsHelper.trialCitiesByState}
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
                options={publicTrialSessionsHelper.trialSessionJudgeOptions}
                selectedValues={judges}
                onChange={handleUpdateFormValue}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);

function FilterSelect({ label, name, onChange, options, selectedValues }) {
  return (
    <>
      <div className="margin-bottom-4">
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
              value && onChange(`${name}.${value}`, value);
            }}
          />
        </Phone>
      </div>
      <NonPhone>
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
      </NonPhone>
    </>
  );
}
