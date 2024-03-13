import { CalculatePenaltiesModal } from './StartCaseInternal/CalculatePenaltiesModal';
import { CaseTypeSelect } from './StartCase/CaseTypeSelect';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { StatisticsForm } from './StartCaseInternal/StatisticsForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const IRSNotice = connect(
  {
    caseDetailEditHelper: state.caseDetailEditHelper,
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    refreshStatisticsSequence: sequences.refreshStatisticsSequence,
    setIrsNoticeFalseSequence: sequences.setIrsNoticeFalseSequence,
    showModal: state.modal.showModal,
    statisticsFormHelper: state.statisticsFormHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validation: sequences[props.validationName],
    validationErrors: state.validationErrors,
  },
  function IRSNotice({
    caseDetailEditHelper,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
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
            <legend>IRS Notice provided?</legend>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="irs-verified-notice-radios"
                checked={form.hasVerifiedIrsNotice === true}
                className="usa-radio__input"
                data-testid="hasVerifiedIrsNotice-yes-radio"
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
                data-testid="has-irs-verified-notice-yes"
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
                data-testid="hasVerifiedIrsNotice-no-radio"
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
                data-testid="has-irs-verified-notice-no"
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
        <DateSelector
          defaultValue={form.irsNoticeDate}
          displayOptionalHintText={true}
          errorText={validationErrors.irsNoticeDate}
          formGroupClassNames={''}
          id="date-of-notice"
          label="Date of notice"
          onChange={e => {
            formatAndUpdateDateFromDatePickerSequence({
              key: 'irsNoticeDate',
              toFormat: constants.DATE_FORMATS.ISO,
              value: e.target.value,
            });
            validation();
          }}
        />
      );
    };

    return (
      <section>
        {renderIrsNoticeRadios()}

        <CaseTypeSelect
          allowDefaultOption={true}
          caseTypes={constants.CASE_TYPES}
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

IRSNotice.displayName = 'IRSNotice';
