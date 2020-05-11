import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpinionSearchByKeyword = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    updateAdvancedOpinionSearchFormValueSequence:
      sequences.updateAdvancedOpinionSearchFormValueSequence,
    validateOpinionSearchSequence: sequences.validateOpinionSearchSequence,
  },
  function OpinionSearchByKeyword({
    advancedSearchForm,
    updateAdvancedOpinionSearchFormValueSequence,
    validateOpinionSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-12">
            <h4>Enter Keyword or Phrase</h4>
            <FormGroup errorText={validationErrors.opinionKeyword}>
              <label className="usa-label" htmlFor="opinion-search">
                Search for...
              </label>
              <input
                className="usa-input"
                id="opinion-search"
                name="opinionKeyword"
                type="text"
                value={advancedSearchForm.opinionSearch.opinionKeyword || ''}
                onBlur={() => validateOpinionSearchSequence()}
                onChange={e => {
                  updateAdvancedOpinionSearchFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
        </div>
      </>
    );
  },
);
