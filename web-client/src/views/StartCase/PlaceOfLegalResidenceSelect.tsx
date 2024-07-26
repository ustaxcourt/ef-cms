import {
  US_STATES,
  US_STATES_OTHER,
} from '@shared/business/entities/EntityConstants';
import React from 'react';
import classNames from 'classnames';

export const PlaceOfLegalResidenceSelect = ({
  className = '',
  data,
  handleBlur,
  handleChange,
  refProp,
  type,
}) => {
  return (
    <select
      className={className ? classNames(className, 'usa-select') : 'usa-select'}
      data-testid={`${type}-placeOfLegalResidence`}
      id={`${type}-placeOfLegalResidence`}
      name={`${type}.placeOfLegalResidence`}
      ref={refProp || undefined}
      value={data.placeOfLegalResidence || ''}
      onBlur={handleBlur}
      onChange={e => {
        handleChange({
          key: e.target.name,
          value: e.target.value,
        });
      }}
    >
      <option value="">- Select -</option>
      <optgroup label="States">
        {Object.keys(US_STATES).map(abbrev => {
          const label = US_STATES[abbrev];
          return (
            <option key={abbrev} value={abbrev}>
              {label}
            </option>
          );
        })}
      </optgroup>

      <optgroup label="Other">
        {Object.keys(US_STATES_OTHER).map(abbrev => {
          const label = US_STATES_OTHER[abbrev];
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
