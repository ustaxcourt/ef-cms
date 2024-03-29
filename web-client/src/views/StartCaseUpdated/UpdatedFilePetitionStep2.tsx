import { camelCase, kebabCase } from 'lodash';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

import { ErrorNotification } from '@web-client/views/ErrorNotification';

export const UpdatedFilePetitionStep2 = connect(
  {
    cerebralBindSimpleSetStateSequence:
      sequences.cerebralBindSimpleSetStateSequence,
    stepIndicatorInfo: state.stepIndicatorInfo,
    updatedFilePetitionHelper: state.updatedFilePetitionHelper,
    updatedFilePetitionStep2State: state.updatedFilePetitionStep2State,
  },
  function UpdatedFilePetitionStep2({
    cerebralBindSimpleSetStateSequence,
    stepIndicatorInfo,
    updatedFilePetitionHelper,
    updatedFilePetitionStep2State,
  }) {
    const { currentStep } = stepIndicatorInfo;
    const { selectedFilingOption } = updatedFilePetitionStep2State;
    return (
      <>
        <ErrorNotification />
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <h2>I am filing this petition on behalf of...</h2>
        <fieldset className="usa-fieldset margin-bottom-2">
          {updatedFilePetitionHelper.filingOptions.map(title => {
            return (
              <div className="usa-radio usa-radio__inline" key={title}>
                <input
                  checked={selectedFilingOption === camelCase(title)}
                  className="usa-radio__input"
                  id={`${kebabCase(title)}-radio-option`}
                  name="selectedFilingOption"
                  type="radio"
                  value={camelCase(title)}
                  onChange={e => {
                    cerebralBindSimpleSetStateSequence({
                      key: updatedFilePetitionHelper.keyGenerator(
                        currentStep,
                        e.target.name,
                      ),
                      value: e.target.value,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor={`${kebabCase(title)}-radio-option`}
                  id={`${kebabCase(title)}-radio-option-label`}
                >
                  {title}
                </label>
              </div>
            );
          })}{' '}
        </fieldset>

        {selectedFilingOption}
      </>
    );
  },
);
