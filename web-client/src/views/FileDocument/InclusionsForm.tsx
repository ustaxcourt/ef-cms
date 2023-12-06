import { Button } from '../../ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const InclusionsForm = connect(
  {
    constants: state.constants,
    data: state[props.bind],
    fileDocumentHelper: state.fileDocumentHelper,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    openCleanModalSequence: sequences.openCleanModalSequence,
    type: props.type,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationData: state[props.validationBind],
  },
  function InclusionsForm({
    constants,
    data,
    fileDocumentHelper,
    formatAndUpdateDateFromDatePickerSequence,
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
                  type === constants.DOCUMENT_RELATIONSHIPS.PRIMARY
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
                  type === constants.DOCUMENT_RELATIONSHIPS.PRIMARY
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
          <DateSelector
            defaultValue={data.certificateOfServiceDate}
            errorText={validationData?.certificateOfServiceDate}
            id={`${type}-service-date`}
            label="Service date"
            onChange={e => {
              formatAndUpdateDateFromDatePickerSequence({
                key:
                  type === constants.DOCUMENT_RELATIONSHIPS.PRIMARY
                    ? 'certificateOfServiceDate'
                    : `${type}.certificateOfServiceDate`,
                toFormat: constants.DATE_FORMATS.ISO,
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

InclusionsForm.displayName = 'InclusionsForm';
