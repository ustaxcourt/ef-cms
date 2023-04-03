import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import React from 'react';

export const ConsolidatedCaseGroupFiling = () => {
  return (
    <>
      <h2 className="margin-top-4">Which Cases Do You Want to File In?</h2>
      <div className="blue-container">
        <FormGroup>
          <fieldset
            className="usa-fieldset margin-bottom-0"
            id="consolidated-case-group-radios"
          >
            <legend
              className="with-hint"
              htmlFor="consolidated-case-group-radios"
              id="consolidated-case-group-radios-legend"
            >
              This case is part of a consolidated group.
            </legend>
            <span className="usa-hint">
              Select the group or this case to file in.
            </span>
            <input
              defaultChecked
              aria-describedby="consolidated-case-group-radios-legend"
              className="usa-radio__input"
              id="consolidated-group-all"
              name="consolidated-group-all"
              type="radio"
              onChange={e => (e.target.checked = true)}
            />
            <label
              className="usa-radio__label"
              htmlFor="consolidated-group-all"
            >
              All in the consolidated group
            </label>
            {/* TODO: map over consolidated cases */}
            <input
              aria-describedby="consolidated-case-group-radios-legend"
              className="usa-radio__input"
              id="consolidated-group-current-case"
              name="consolidated-group-current-case"
              type="radio"
              onChange={e => (e.target.checked = true)}
            />
            <label
              className="usa-radio__label"
              htmlFor="consolidated-group-current-case"
            >
              {/* TODO: get current case information */}
              Current case
            </label>
          </fieldset>
        </FormGroup>
      </div>
    </>
  );
};
