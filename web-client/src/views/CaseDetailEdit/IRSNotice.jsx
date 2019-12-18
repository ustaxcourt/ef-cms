import { CaseTypeSelect } from '../StartCase/CaseTypeSelect';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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
        <FormGroup errorText={caseDetailErrors.irsNoticeDate}>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="date-of-notice-legend">
              Date of notice <span className="usa-hint">(optional)</span>
            </legend>
            <div className="usa-memorable-date">
              <div className="usa-form-group usa-form-group--month margin-bottom-0">
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="month, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    caseDetailErrors.irsNoticeDate && 'usa-input--error',
                  )}
                  id="date-of-notice-month"
                  max="12"
                  min="1"
                  name="irsMonth"
                  placeholder="MM"
                  type="number"
                  value={form.irsMonth || ''}
                  onBlur={() => validateCaseDetailSequence()}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--day margin-bottom-0">
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="day, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    caseDetailErrors.irsNoticeDate && 'usa-input--error',
                  )}
                  id="date-of-notice-day"
                  max="31"
                  min="1"
                  name="irsDay"
                  placeholder="DD"
                  type="number"
                  value={form.irsDay || ''}
                  onBlur={() => validateCaseDetailSequence()}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--year margin-bottom-0">
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="year, four digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    caseDetailErrors.irsNoticeDate && 'usa-input--error',
                  )}
                  id="date-of-notice-year"
                  max="2100"
                  min="1900"
                  name="irsYear"
                  placeholder="YYYY"
                  type="number"
                  value={form.irsYear || ''}
                  onBlur={() => validateCaseDetailSequence()}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </fieldset>
        </FormGroup>
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
