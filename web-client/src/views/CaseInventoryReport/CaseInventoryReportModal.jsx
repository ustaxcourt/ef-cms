import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseInventoryReportModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseInventoryReportHelper: state.caseInventoryReportHelper,
    confirmSequence: sequences.getCaseInventoryReportSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateCaseInventoryReportModalSequence:
      sequences.validateCaseInventoryReportModalSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    caseInventoryReportHelper,
    confirmSequence,
    updateModalValueSequence,
    validateCaseInventoryReportModalSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="case-inventory-report-modal"
        confirmLabel="Run Report"
        confirmSequence={confirmSequence}
        title="Run Case Inventory Report"
      >
        <p className="margin-top-0">
          Select the case status, Judge, or both to run the report.
        </p>
        <div className="margin-bottom-4">
          <FormGroup errorText={validationErrors.status}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="case-status">
                Select case status
              </legend>
              <select
                aria-labelledby="case-status"
                className={classNames(
                  'usa-select',
                  validationErrors.status && 'usa-select--error',
                )}
                name="status"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateCaseInventoryReportModalSequence();
                }}
              >
                <option value="">- Select -</option>
                {Object.values(caseInventoryReportHelper.caseStatuses).map(
                  status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ),
                )}
              </select>
            </fieldset>
          </FormGroup>

          <FormGroup errorText={validationErrors.associatedJudge}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="associated-judge">
                Select Judge
              </legend>
              <select
                aria-labelledby="associated-judge"
                className={classNames(
                  'usa-select',
                  validationErrors.associatedJudge && 'usa-select--error',
                )}
                name="associatedJudge"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateCaseInventoryReportModalSequence();
                }}
              >
                <option value="">- Select -</option>
                {caseInventoryReportHelper.judges.map(judge => (
                  <option key={judge} value={judge}>
                    {judge}
                  </option>
                ))}
              </select>
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
