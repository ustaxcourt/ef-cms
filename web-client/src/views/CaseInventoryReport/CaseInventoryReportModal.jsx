import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseInventoryReportModal = connect(
  {
    STATUS_TYPES: state.constants.STATUS_TYPES,
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.getCaseInventoryReportSequence,
    judges: state.judges,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateCaseInventoryReportModalSequence:
      sequences.validateCaseInventoryReportModalSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    confirmSequence,
    judges,
    STATUS_TYPES,
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
                {Object.values(STATUS_TYPES).map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </fieldset>
          </FormGroup>

          <FormGroup errorText={validationErrors.associatedJudge}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="associated-judge">
                Select Judge
              </legend>
              <select
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
                <option value="Chief Judge">Chief Judge</option>
                {judges.map(judge => (
                  <option key={judge.name} value={judge.name}>
                    {judge.name}
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
