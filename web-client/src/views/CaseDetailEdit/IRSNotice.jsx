import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseTypeSelect } from '../StartCase/CaseTypeSelect';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { StatisticsForm } from '../StartCaseInternal/StatisticsForm';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
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
    validation: sequences[props.validationName],
    validationErrors: state.validationErrors,
  },
  function IRSNotice({
    CASE_TYPES,
    caseDetailEditHelper,
    form,
    refreshStatisticsSequence,
    setIrsNoticeFalseSequence,
    shouldStartWithBlankStatistic = true,
    showModal,
    statisticsFormHelper,
    updateFormValueSequence,
    validation,
    validationErrors,
    validationName,
  }) {
    const renderIrsNoticeRadios = () => {
      return (
        <FormGroup errorText={validationErrors.hasVerifiedIrsNotice}>
          <fieldset
            className="usa-fieldset margin-bottom-0"
            id="irs-verified-notice-radios"
          >
            <legend htmlFor="irs-verified-notice-radios">
              IRS Notice provided?
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
                  if (shouldStartWithBlankStatistic) {
                    refreshStatisticsSequence();
                  }
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
        </FormGroup>
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
          onBlur={validation}
          onChange={updateFormValueSequence}
        />
      );
    };

    return (
      <section>
        {renderIrsNoticeRadios()}

        <CaseTypeSelect
          allowDefaultOption={true}
          caseTypes={CASE_TYPES}
          legend="Type of case"
          validation={validationName}
          value={form.caseType}
          onChange="updateFormValueSequence"
          onChangePreValidation="refreshStatisticsSequence"
        />

        {caseDetailEditHelper.shouldShowIrsNoticeDate && renderIrsNoticeDate()}

        {statisticsFormHelper.showStatisticsForm && <StatisticsForm />}

        {showModal === 'CalculatePenaltiesModal' && <CalculatePenaltiesModal />}
      </section>
    );
  },
);
