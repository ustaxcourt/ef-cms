import { Button } from '../../ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const SupportingDocumentInclusionsForm = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    data: state[props.bind],
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    index: props.index,
    openCleanModalSequence: sequences.openCleanModalSequence,
    type: props.type,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationData: state[props.validationBind],
  },
  function SupportingDocumentInclusionsForm({
    data,
    DATE_FORMATS,
    formatAndUpdateDateFromDatePickerSequence,
    index,
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
            !data.certificateOfService && 'margin-bottom-0',
          )}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id={`${type}-${index}-extra-items-legend`}>
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
                id={`${type}-${index}-attachments`}
                name={`${type}.${index}.attachments`}
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
                htmlFor={`${type}-${index}-attachments`}
              >
                Attachment(s)
              </label>
            </div>

            <div className="usa-checkbox">
              <input
                checked={data.certificateOfService || false}
                className="usa-checkbox__input"
                id={`${type}-${index}-certificateOfService`}
                name={`${type}.${index}.certificateOfService`}
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
                className="inline-block supporting-document-certificate-of-service usa-checkbox__label"
                htmlFor={`${type}-${index}-certificateOfService`}
              >
                Certificate Of Service
              </label>
            </div>
          </fieldset>
        </div>
        {data.certificateOfService && (
          <DateSelector
            defaultValue={data.certificateOfServiceDate}
            errorText={validationData?.certificateOfServiceDate}
            id={`${type}-${index}-service-date`}
            label="Service date"
            onChange={e => {
              formatAndUpdateDateFromDatePickerSequence({
                key: `${type}.${index}.certificateOfServiceDate`,
                toFormat: DATE_FORMATS.ISO,
                value: e.target.value,
              });
              validateExternalDocumentInformationSequence();
            }}
          />
        )}
      </>
    );
  },
);

SupportingDocumentInclusionsForm.displayName =
  'SupportingDocumentInclusionsForm';
