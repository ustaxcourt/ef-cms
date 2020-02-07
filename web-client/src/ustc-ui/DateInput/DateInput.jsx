import { FormGroup } from '../FormGroup/FormGroup';
import React from 'react';
import classNames from 'classnames';

export const DateInput = props => {
  const {
    errorText,
    id,
    label,
    onBlur = () => {},
    onChange = () => {},
    values = {},
    names = {
      day: 'day',
      month: 'month',
      year: 'year',
    },
    className = '',
    hideLegend,
    optional = false,
  } = props;

  return (
    <FormGroup className={className} errorText={errorText}>
      <fieldset className="usa-fieldset margin-bottom-0">
        <legend
          className={classNames('usa-legend', hideLegend && 'usa-sr-only')}
          id={`${id}-legend`}
        >
          {label} {optional && <span className="usa-hint">(optional)</span>}
        </legend>
        <div className="usa-memorable-date">
          <div className="usa-form-group usa-form-group--month margin-bottom-0">
            <input
              aria-describedby={`${id}-legend`}
              aria-label="month, two digits"
              className="usa-input usa-input-inline"
              id={`${id}-month`}
              max="12"
              maxLength="2"
              min="1"
              name={names.month}
              placeholder="MM"
              type="text"
              value={values.month || ''}
              onBlur={() => onBlur()}
              onChange={e => {
                onChange({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
          <div className="usa-form-group usa-form-group--day margin-bottom-0">
            <input
              aria-describedby={`${id}-legend`}
              aria-label="day, two digits"
              className="usa-input usa-input-inline"
              id={`${id}-day`}
              max="31"
              maxLength="2"
              min="1"
              name={names.day}
              placeholder="DD"
              type="text"
              value={values.day || ''}
              onBlur={() => onBlur()}
              onChange={e => {
                onChange({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
          <div className="usa-form-group usa-form-group--year margin-bottom-0">
            <input
              aria-describedby={`${id}-legend`}
              aria-label="year, four digits"
              className="usa-input usa-input-inline"
              id={`${id}-year`}
              max="2100"
              maxLength="4"
              min="1900"
              name={names.year}
              placeholder="YYYY"
              type="text"
              value={values.year || ''}
              onBlur={() => onBlur()}
              onChange={e => {
                onChange({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </fieldset>
    </FormGroup>
  );
};
