import React from 'react';
import classNames from 'classnames';

export const PlaceOfLegalResidenceSelect = ({
  className = '',
  data,
  type,
  updateFormValueSequence,
  usStates,
  usStatesOther,
  // validateStartCaseSequence,
}) => {
  return (
    <select
      className={className ? classNames(className, 'usa-select') : 'usa-select'}
      data-testid={`${type}.placeOfLegalResidence`}
      id={`${type}.placeOfLegalResidence`}
      name={`${type}.placeOfLegalResidence`}
      value={data[type].placeOfLegalResidence || ''}
      onChange={e => {
        updateFormValueSequence({
          key: e.target.name,
          value: e.target.value,
        });
        // validateStartCaseSequence();
      }}
    >
      <option value="">- Select -</option>
      <optgroup label="States">
        {Object.keys(usStates).map(abbrev => {
          const label = usStates[abbrev];
          return (
            <option key={abbrev} value={abbrev}>
              {label}
            </option>
          );
        })}
      </optgroup>

      <optgroup label="Territory">
        {Object.keys(usStatesOther).map(abbrev => {
          const label = usStatesOther[abbrev];
          return (
            <option key={abbrev} value={abbrev}>
              {label}
            </option>
          );
        })}
      </optgroup>

      <optgroup label="Other">
        <option value={'Other'}>Other</option>
      </optgroup>
    </select>
  );
};

PlaceOfLegalResidenceSelect.displayName = 'PlaceOfLegalResidenceSelect';
