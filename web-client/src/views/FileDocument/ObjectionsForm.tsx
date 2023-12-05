import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ObjectionsForm = connect(
  {
    DOCUMENT_RELATIONSHIPS: state.constants.DOCUMENT_RELATIONSHIPS,
    OBJECTIONS_OPTIONS: state.constants.OBJECTIONS_OPTIONS,
    data: state[props.bind],
    type: props.type,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationData: state[props.validationBind],
  },
  function ObjectionsForm({
    data,
    DOCUMENT_RELATIONSHIPS,
    OBJECTIONS_OPTIONS,
    type,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationData,
  }) {
    return (
      <>
        <FormGroup errorText={validationData && validationData.objections}>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id={`${type}-objections-legend`}>
              Are there any objections to the granting of this document?
            </legend>
            {OBJECTIONS_OPTIONS.map(option => (
              <div className="usa-radio usa-radio__inline" key={option}>
                <input
                  aria-describedby={`${type}-objections-legend`}
                  checked={data.objections === option}
                  className="usa-radio__input"
                  id={`${type}-objections-${option}`}
                  name={`${
                    type === DOCUMENT_RELATIONSHIPS.PRIMARY
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
        </FormGroup>
      </>
    );
  },
);

ObjectionsForm.displayName = 'ObjectionsForm';
