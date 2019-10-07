import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const ObjectionsForm = connect(
  {
    data: state[props.bind],
    type: props.type,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationBind: props.validationBind,
    validationData: state[props.validationBind],
  },
  ({
    data,
    type,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationBind,
    validationData,
  }) => {
    return (
      <>
        <div
          className={classNames(
            'usa-form-group margin-bottom-0',
            validationData &&
              validationData.objections &&
              'usa-form-group--error',
          )}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id={`${type}-objections-legend`}>
              Are there any objections to this document?
            </legend>
            {['Yes', 'No', 'Unknown'].map(option => (
              <div className="usa-radio usa-radio__inline" key={option}>
                <input
                  aria-describedby={`${type}-objections-legend`}
                  checked={data.objections === option}
                  className="usa-radio__input"
                  id={`${type}-objections-${option}`}
                  name={`${
                    type === 'primaryDocument'
                      ? 'objections'
                      : `${type}.objections`
                  }`}
                  type="radio"
                  value={option}
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor={`${type}-objections-${option}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </fieldset>
          <Text
            bind={`${validationBind}.objections`}
            className="usa-error-message"
          />
        </div>
      </>
    );
  },
);
