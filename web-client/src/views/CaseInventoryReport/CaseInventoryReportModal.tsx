import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseInventoryReportModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseInventoryReportHelper: state.caseInventoryReportHelper,
    confirmSequence: sequences.submitCaseInventoryReportModalSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateCaseInventoryReportModalSequence:
      sequences.validateCaseInventoryReportModalSequence,
    validationErrors: state.validationErrors,
  },
  function CaseInventoryReportModal({
    cancelSequence,
    caseInventoryReportHelper,
    confirmSequence,
    updateScreenMetadataSequence,
    validateCaseInventoryReportModalSequence,
    validationErrors,
  }) {
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
                id="select-case-inventory-status"
                name="status"
                onChange={e => {
                  updateScreenMetadataSequence({
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
                id="select-case-inventory-judge"
                name="associatedJudge"
                onChange={e => {
                  updateScreenMetadataSequence({
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

CaseInventoryReportModal.displayName = 'CaseInventoryReportModal';
