import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ConsolidatedCaseGroupFiling = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function ConsolidatedCaseGroupFiling({
    fileDocumentHelper,
    form,
    updateFormValueSequence,
  }) {
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
                aria-describedby="consolidated-case-group-radios-legend"
                checked={form.fileAcrossConsolidatedGroup === true}
                className="usa-radio__input"
                id="consolidated-group-all"
                name="fileAcrossConsolidatedGroup"
                type="radio"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: true,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="consolidated-group-all"
              >
                All in the consolidated group
              </label>
              <ul className="ustc-unstyled-consolidated-case-list">
                {fileDocumentHelper.formattedConsolidatedCaseList.map(
                  (item, index) => (
                    <li className="margin-bottom-2" key={index}>
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <input
                aria-describedby="consolidated-case-group-radios-legend"
                checked={form.fileAcrossConsolidatedGroup === false}
                className="usa-radio__input"
                id="consolidated-group-current-case"
                name="fileAcrossConsolidatedGroup"
                type="radio"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: false,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="consolidated-group-current-case"
              >
                {fileDocumentHelper.formattedCurrentCasePetitionerNames}
              </label>
            </fieldset>
          </FormGroup>
        </div>
      </>
    );
  },
);
