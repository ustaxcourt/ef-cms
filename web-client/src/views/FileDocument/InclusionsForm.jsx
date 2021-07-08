import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const InclusionsForm = connect(
  {
    DOCUMENT_RELATIONSHIPS: state.constants.DOCUMENT_RELATIONSHIPS,
    data: state[props.bind],
    fileDocumentHelper: state.fileDocumentHelper,
    openCleanModalSequence: sequences.openCleanModalSequence,
    type: props.type,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationData: state[props.validationBind],
  },
  function InclusionsForm({
    data,
    DOCUMENT_RELATIONSHIPS,
    fileDocumentHelper,
    openCleanModalSequence,
    type,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationData,
  }) {
    return (
      <>
        <div
          className={classNames(
            'usa-form-group',
            !fileDocumentHelper[type].showObjection &&
              !data.certificateOfService &&
              'margin-bottom-0',
          )}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id={`${type}-extra-items-legend`}>
              Select extra items to include with your document
              <Button
                link
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
                name={`${
                  type === DOCUMENT_RELATIONSHIPS.PRIMARY
                    ? 'attachments'
                    : `${type}.attachments`
                }`}
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
                name={`${
                  type === DOCUMENT_RELATIONSHIPS.PRIMARY
                    ? 'certificateOfService'
                    : `${type}.certificateOfService`
                }`}
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
                id={`${type}-certificateOfService-label`}
              >
                Certificate Of Service
              </label>
            </div>
          </fieldset>
        </div>
        {data.certificateOfService && (
          <DateInput
            className={`${type}-service-date`}
            errorText={validationData?.certificateOfServiceDate}
            id={`${type}-service-date`}
            label="Service date"
            names={{
              day: `${
                type === DOCUMENT_RELATIONSHIPS.PRIMARY
                  ? 'certificateOfServiceDay'
                  : `${type}.certificateOfServiceDay`
              }`,
              month: `${
                type === DOCUMENT_RELATIONSHIPS.PRIMARY
                  ? 'certificateOfServiceMonth'
                  : `${type}.certificateOfServiceMonth`
              }`,
              year: `${
                type === DOCUMENT_RELATIONSHIPS.PRIMARY
                  ? 'certificateOfServiceYear'
                  : `${type}.certificateOfServiceYear`
              }`,
            }}
            values={{
              day: data.certificateOfServiceDay,
              month: data.certificateOfServiceMonth,
              year: data.certificateOfServiceYear,
            }}
            onBlur={validateExternalDocumentInformationSequence}
            onChange={updateFileDocumentWizardFormValueSequence}
          />
        )}
      </>
    );
  },
);
