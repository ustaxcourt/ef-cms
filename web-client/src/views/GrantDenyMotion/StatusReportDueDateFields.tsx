import { TimeFormats } from '@shared/business/utilities/DateHandler';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { formatAndUpdateDateFromDatePickerSequence } from '@web-client/presenter/sequences/formatAndUpdateDateFromDatePickerSequence';
import { updateGrantDenyMotionFormValueSequence } from '@web-client/presenter/sequences/GrantDenyMotion/updateGrantDenyMotionFormValueSequence';
import { validateGrantDenyMotionSequence } from '@web-client/presenter/sequences/GrantDenyMotion/validateGrantDenyMotionSequence';
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
    petitioners: string;
    respondent: string;
  };
  formatAndUpdateDateFromDatePickerSequence: typeof formatAndUpdateDateFromDatePickerSequence;
  minDate: string;
  updateFormValueSequence: typeof updateGrantDenyMotionFormValueSequence;
  validateGrantDenyMotionSequence: typeof validateGrantDenyMotionSequence;
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
      <FormGroup errorText={filingPartyErrorText}>
        <label className="usa-label" htmlFor="filing-party">
          Filing Party
        </label>
        <select
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
        </select>
      </FormGroup>

      <FormGroup errorText={dueDateErrorText}>
        <DateSelector
          defaultValue={dueDate}
          formGroupClassNames="display-inline-block padding-0"
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
      </FormGroup>
    </div>
  );
};

StatusReportDueDateFields.displayName = 'StatusReportDueDateFields';
