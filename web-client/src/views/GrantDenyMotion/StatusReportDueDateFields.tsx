import type { TimeFormats } from '@shared/business/utilities/DateHandler';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { RunableSequence as RunnableSequence } from 'cerebral';
import classNames from 'classnames';
import React from 'react';

export type StatusReportDueDateFieldsProps = {
  constants: {
    DATE_FORMATS: {
      YYYYMMDD: TimeFormats;
    };
  };
  dueDate: string | undefined;
  dueDateErrorText?: string;
  filingParty: string | null | undefined;
  filingPartyErrorText?: string;
  filingPartyOptions: {
    joint: string;
    parties: string;
    petitioners: string;
    respondent: string;
  };
  formatAndUpdateDateFromDatePickerSequence: Function | RunnableSequence;
  minDate: string;
  updateFormValueSequence: Function | RunnableSequence;
  validateGrantDenyMotionSequence: Function | RunnableSequence;
};

export const StatusReportDueDateFields: React.FC<
  StatusReportDueDateFieldsProps
> = ({
  constants,
  dueDate,
  dueDateErrorText,
  filingParty,
  filingPartyErrorText,
  filingPartyOptions,
  formatAndUpdateDateFromDatePickerSequence,
  minDate,
  updateFormValueSequence,
  validateGrantDenyMotionSequence,
}) => {
  return (
    <div
      className="grant-deny-motion-status-report-fields"
      data-testid="status-report-due-date-fields"
    >
      <div className="grant-deny-motion-status-report-field">
        <div
          className={classNames(
            'grant-deny-motion-status-report-field-inputs',
            'usa-form-group',
            filingPartyErrorText && 'usa-form-group--error',
          )}
        >
          <label className="usa-label" htmlFor="filing-party">
            Filing Party
          </label>
          <select
            aria-describedby={
              filingPartyErrorText ? 'filing-party-error' : undefined
            }
            aria-invalid={filingPartyErrorText ? true : undefined}
            className="usa-select"
            data-testid="filing-party"
            id="filing-party"
            name="filingParty"
            value={filingParty || ''}
            onChange={e =>
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              })
            }
          >
            <option value="">- Select -</option>
            <option value={filingPartyOptions.petitioners}>
              {filingPartyOptions.petitioners}
            </option>
            <option value={filingPartyOptions.respondent}>
              {filingPartyOptions.respondent}
            </option>
            <option value={filingPartyOptions.joint}>
              {filingPartyOptions.joint}
            </option>
            <option value={filingPartyOptions.parties}>
              {filingPartyOptions.parties}
            </option>
          </select>
        </div>
        {filingPartyErrorText && (
          <span
            className="usa-error-message"
            data-testid="filing-party-error"
            id="filing-party-error"
          >
            {filingPartyErrorText}
          </span>
        )}
      </div>

      <div className="grant-deny-motion-status-report-field">
        <div
          className={classNames(
            'grant-deny-motion-status-report-field-inputs',
            'usa-form-group',
            dueDateErrorText && 'usa-form-group--error',
          )}
        >
          <DateSelector
            defaultValue={dueDate}
            formGroupClassNames="display-inline-block padding-0 grant-deny-motion-status-report-due-date"
            id="grant-deny-due-date"
            label="Due Date:"
            minDate={minDate}
            placeHolderText="MM/DD/YYYY"
            onChange={e => {
              formatAndUpdateDateFromDatePickerSequence({
                key: 'dueDate',
                toFormat: constants.DATE_FORMATS.YYYYMMDD,
                value: e.target.value,
              });
              validateGrantDenyMotionSequence();
            }}
          />
        </div>
        {dueDateErrorText && (
          <span
            className="usa-error-message"
            data-testid="grant-deny-due-date-error"
            id="grant-deny-due-date-error"
          >
            {dueDateErrorText}
          </span>
        )}
      </div>
    </div>
  );
};

StatusReportDueDateFields.displayName = 'StatusReportDueDateFields';
