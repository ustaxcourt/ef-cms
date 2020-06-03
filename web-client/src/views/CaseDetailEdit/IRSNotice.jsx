import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseTypeSelect } from '../StartCase/CaseTypeSelect';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { StatisticsForm } from '../StartCaseInternal/StatisticsForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const IRSNotice = connect(
  {
    CASE_TYPES: state.constants.CASE_TYPES,
    caseDetailEditHelper: state.caseDetailEditHelper,
    form: state.form,
    refreshStatisticsSequence: sequences.refreshStatisticsSequence,
    setIrsNoticeFalseSequence: sequences.setIrsNoticeFalseSequence,
    showModal: state.modal.showModal,
    statisticsFormHelper: state.statisticsFormHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDetailSequence: sequences.validateCaseDetailSequence,
    validationErrors: state.validationErrors,
  },
  function IRSNotice({
    CASE_TYPES,
    caseDetailEditHelper,
    form,
    refreshStatisticsSequence,
    setIrsNoticeFalseSequence,
    showModal,
    statisticsFormHelper,
    updateFormValueSequence,
    validateCaseDetailSequence,
    validationErrors,
  }) {
    const renderIrsNoticeRadios = () => {
      return (
        <fieldset className="usa-fieldset" id="irs-verified-notice-radios">
          <legend htmlFor="irs-verified-notice-radios">
            Notice attached to petition?
          </legend>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="irs-verified-notice-radios"
              checked={form.hasVerifiedIrsNotice === true}
              className="usa-radio__input"
              id="hasVerifiedIrsNotice-yes"
              name="hasVerifiedIrsNotice"
              type="radio"
              value="Yes"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: true,
                });
                refreshStatisticsSequence();
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
              checked={form.hasVerifiedIrsNotice === false}
              className="usa-radio__input"
              id="hasVerifiedIrsNotice-no"
              name="hasVerifiedIrsNotice"
              type="radio"
              value="No"
              onChange={() => {
                setIrsNoticeFalseSequence();
                refreshStatisticsSequence();
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
          errorText={validationErrors.irsNoticeDate}
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
          caseTypes={CASE_TYPES}
          legend="Type of case"
          validation="validateCaseDetailSequence"
          value={form.caseType}
          onChange="updateFormValueSequence"
          onChangePreValidation="refreshStatisticsSequence"
        />

        {caseDetailEditHelper.shouldShowIrsNoticeDate && renderIrsNoticeDate()}

        {statisticsFormHelper.showStatisticsForm && <StatisticsForm />}

        {showModal === 'CalculatePenaltiesModal' && <CalculatePenaltiesModal />}
      </div>
    );
  },
);
