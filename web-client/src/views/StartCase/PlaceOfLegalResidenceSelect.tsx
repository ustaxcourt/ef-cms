import React from 'react';
import classNames from 'classnames';

export const PlaceOfLegalResidenceSelect = ({
  className = '',
  data,
  onBlur,
  refProp,
  type,
  updateFormValueSequence,
  usStates,
  usStatesOther,
}) => {
  return (
    <select
      className={className ? classNames(className, 'usa-select') : 'usa-select'}
      data-testid={`${type}.placeOfLegalResidence`}
      id={`${type}.placeOfLegalResidence`}
      name={`${type}.placeOfLegalResidence`}
      ref={refProp || undefined}
      value={data[type].placeOfLegalResidence || ''}
      onBlur={onBlur}
      onChange={e => {
        updateFormValueSequence({
          key: e.target.name,
          value: e.target.value,
        });
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

      <optgroup label="Other">
        {Object.keys(usStatesOther).map(abbrev => {
          const label = usStatesOther[abbrev];
          return (
            <option key={abbrev} value={abbrev}>
              {label}
            </option>
          );
        })}
        <option value={'Other'}>Other</option>
      </optgroup>
    </select>
  );
};
