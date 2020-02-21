import { CaseTypeSelect } from '../StartCase/CaseTypeSelect';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const IRSNotice = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailErrors: state.caseDetailErrors,
    caseTypes: state.caseTypes,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    setIrsNoticeFalseSequence: sequences.setIrsNoticeFalseSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDetailSequence: sequences.validateCaseDetailSequence,
  },
  ({
    caseDetail,
    caseDetailErrors,
    caseTypes,
    form,
    formattedCaseDetail,
    setIrsNoticeFalseSequence,
    updateCaseValueSequence,
    updateFormValueSequence,
    validateCaseDetailSequence,
  }) => {
    const renderIrsNoticeRadios = () => {
      return (
        <fieldset className="usa-fieldset" id="irs-verified-notice-radios">
          <legend htmlFor="irs-verified-notice-radios">
            Notice attached to petition?
          </legend>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="irs-verified-notice-radios"
              checked={caseDetail.hasVerifiedIrsNotice === true}
              className="usa-radio__input"
              id="hasVerifiedIrsNotice-yes"
              name="hasVerifiedIrsNotice"
              type="radio"
              value="Yes"
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: true,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="hasVerifiedIrsNotice-yes"
              id="has-irs-verified-notice-yes"
            >
              Yes
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="irs-verified-notice-radios"
              checked={caseDetail.hasVerifiedIrsNotice === false}
              className="usa-radio__input"
              id="hasVerifiedIrsNotice-no"
              name="hasVerifiedIrsNotice"
              type="radio"
              value="No"
              onChange={() => {
                setIrsNoticeFalseSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="hasVerifiedIrsNotice-no"
              id="has-irs-verified-notice-no"
            >
              No
            </label>
          </div>
        </fieldset>
      );
    };

    const renderIrsNoticeDate = () => {
      return (
        <DateInput
          errorText={caseDetailErrors.irsNoticeDate}
          id="date-of-notice"
          label="Date of notice"
          names={{
            day: 'irsDay',
            month: 'irsMonth',
            year: 'irsYear',
          }}
          optional={true}
          values={{
            day: form.irsDay,
            month: form.irsMonth,
            year: form.irsYear,
          }}
          onBlur={validateCaseDetailSequence}
          onChange={updateFormValueSequence}
        />
      );
    };

    return (
      <div className="blue-container">
        {renderIrsNoticeRadios()}

        <CaseTypeSelect
          allowDefaultOption={true}
          caseTypes={caseTypes}
          legend="Type of case"
          validation="validateCaseDetailSequence"
          value={caseDetail.caseType}
          onChange="updateCaseValueSequence"
        />

        {formattedCaseDetail.shouldShowIrsNoticeDate && renderIrsNoticeDate()}
      </div>
    );
  },
);
