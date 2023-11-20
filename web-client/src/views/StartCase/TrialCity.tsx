import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const TrialCity = connect(
  {
    label: props.label,
    onChange: props.onChange,
    showDefaultOption: props.showDefaultOption,
    showHint: props.showHint,
    showRegularTrialCitiesHint: props.showRegularTrialCitiesHint,
    showSmallTrialCitiesHint: props.showSmallTrialCitiesHint,
    trialCitiesByState: props.trialCitiesByState,
    validationErrors: state.validationErrors,
    value: props.value,
  },
  function TrialCity({
    label,
    onChange,
    procedureType,
    showDefaultOption,
    showHint,
    showRegularTrialCitiesHint,
    showSmallTrialCitiesHint,
    validationErrors,
    value,
  }) {
    return (
      <FormGroup
        errorText={[
          validationErrors.preferredTrialCity,
          !!validationErrors['object.missing'],
        ]}
      >
        <label
          className={classNames('usa-label', showHint && 'with-hint')}
          htmlFor="preferred-trial-city"
        >
          {label}
        </label>
        {showHint && (
          <span className="usa-hint">
            {showSmallTrialCitiesHint && (
              <>
                Trial locations are unavailable in the following states: DE, NH,
                NJ, RI.
              </>
            )}
            {showRegularTrialCitiesHint && (
              <>
                Trial locations are unavailable in the following states: DE, KS,
                ME, NH, NJ, ND, RI, SD, VT, WY.
              </>
            )}
          </span>
        )}
        <select
          className="usa-select"
          data-testid="preferred-trial-city"
          id="preferred-trial-city"
          name="preferredTrialCity"
          value={value}
          onChange={onChange}
        >
          {showDefaultOption && <option value="">-- Select --</option>}
          <TrialCityOptions procedureType={procedureType} />
        </select>
      </FormGroup>
    );
  },
);

TrialCity.displayName = 'TrialCity';
