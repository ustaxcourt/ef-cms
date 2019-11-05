import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const SupportingDocumentInclusionsForm = connect(
  {
    data: state[props.bind],
    openCleanModalSequence: sequences.openCleanModalSequence,
    type: props.type,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationData: state[props.validationBind],
  },
  ({
    data,
    openCleanModalSequence,
    type,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationData,
  }) => {
    return (
      <>
        <div
          className={classNames(
            'usa-form-group',
            !data.certificateOfService && 'margin-bottom-0',
          )}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id={`${type}-extra-items-legend`}>
              Select extra items to include with your document
              <Button
                link
                className="margin-top-1"
                onClick={() =>
                  openCleanModalSequence({
                    showModal: 'WhatCanIIncludeModalOverlay',
                  })
                }
              >
                <FontAwesomeIcon
                  className="margin-right-05"
                  icon="question-circle"
                  size="1x"
                />
                What can I include with my document?
              </Button>
            </legend>
            <div className="usa-checkbox">
              <input
                checked={data.attachments || false}
                className="usa-checkbox__input"
                id={`${type}-attachments`}
                name={`${type}.attachments`}
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`${type}-attachments`}
              >
                Attachment(s)
              </label>
            </div>

            <div className="usa-checkbox">
              <input
                checked={data.certificateOfService || false}
                className="usa-checkbox__input"
                id={`${type}-certificateOfService`}
                name={`${type}.certificateOfService`}
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`${type}-certificateOfService`}
              >
                Certificate Of Service
              </label>
            </div>
          </fieldset>
        </div>
        {data.certificateOfService && (
          <FormGroup
            errorText={
              validationData && validationData.certificateOfServiceDate
            }
          >
            <fieldset className="service-date usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id={`${type}-service-date-legend`}>
                Service date
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month">
                  <label
                    aria-hidden="true"
                    className="usa-label"
                    htmlFor={`${type}-service-date-month`}
                  >
                    MM
                  </label>
                  <input
                    aria-describedby={`${type}-service-date-legend`}
                    aria-label="month, two digits"
                    className="usa-input usa-input-inline"
                    id={`${type}-service-date-month`}
                    max="12"
                    min="1"
                    name={`${type}.certificateOfServiceMonth`}
                    type="number"
                    value={data.certificateOfServiceMonth || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day">
                  <label
                    aria-hidden="true"
                    className="usa-label"
                    htmlFor={`${type}-service-date-day`}
                  >
                    DD
                  </label>
                  <input
                    aria-describedby={`${type}-service-date-legend`}
                    aria-label="day, two digits"
                    className="usa-input usa-input-inline"
                    id={`${type}-service-date-day`}
                    max="31"
                    min="1"
                    name={`${type}.certificateOfServiceDay`}
                    type="number"
                    value={data.certificateOfServiceDay || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year">
                  <label
                    aria-hidden="true"
                    className="usa-label"
                    htmlFor={`${type}-service-date-year`}
                  >
                    YYYY
                  </label>
                  <input
                    aria-describedby={`${type}-service-date-legend`}
                    aria-label="year, four digits"
                    className="usa-input usa-input-inline"
                    id={`${type}-service-date-year`}
                    max="2100"
                    min="1900"
                    name={`${type}.certificateOfServiceYear`}
                    type="number"
                    value={data.certificateOfServiceYear || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
          </FormGroup>
        )}
      </>
    );
  },
);
