import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

type TrialCityType = {
  label: string;
  onBlur: () => void;
  onChange: (event: any) => void;
  procedureType: string;
  showDefaultOption: boolean;
  showHint?: boolean;
  showRegularTrialCitiesHint?: boolean;
  showSmallTrialCitiesHint?: boolean;
  value: string;
};

const trialCityDependencies = {
  validationErrors: state.validationErrors,
};

export const TrialCity = connect<TrialCityType, typeof trialCityDependencies>(
  trialCityDependencies,
  function TrialCity({
    label,
    onBlur,
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
        errorMessageId="trial-city-error-message"
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
          onBlur={onBlur}
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
