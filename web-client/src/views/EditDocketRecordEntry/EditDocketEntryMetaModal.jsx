import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaModal = connect(
  {
    form: state.modal.form,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateDocketRecordSequence: sequences.validateDocketRecordSequence,
    validationErrors: state.modal.validationErrors,
  },
  ({
    form,
    updateModalValueSequence,
    validateDocketRecordSequence,
    validationErrors,
  }) => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="edit-docket-record-entry-modal"
        confirmLabel="Update docket record"
        preventCancelOnBlur={true}
        title="What would you like to change on the Docket Record?"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="submitEditDocketEntryMetaSequence"
      >
        <FormGroup errorText={validationErrors && validationErrors.filingDate}>
          <label
            className="usa-label"
            htmlFor="filingDate"
            id="filing-date-label"
          >
            Date
          </label>
          <input
            aria-describedby="filing-date-label"
            className="usa-input"
            id="filingDate"
            name="form.filingDate"
            type="text"
            value={form.filingDate || ''}
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketRecordSequence();
            }}
          />
        </FormGroup>
        <FormGroup errorText={validationErrors && validationErrors.description}>
          <label
            className="usa-label"
            htmlFor="description"
            id="description-label"
          >
            Filings and proceedings
          </label>
          <input
            aria-describedby="description-label"
            className="usa-input"
            id="description"
            name="form.description"
            type="text"
            value={form.description || ''}
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketRecordSequence();
            }}
          />
        </FormGroup>
        <FormGroup errorText={validationErrors && validationErrors.filedBy}>
          <label className="usa-label" htmlFor="filedBy" id="filed-by-label">
            Filed by
          </label>
          <input
            aria-describedby="filed-by-label"
            className="usa-input"
            id="filedBy"
            name="form.filedBy"
            type="text"
            value={form.filedBy || ''}
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketRecordSequence();
            }}
          />
        </FormGroup>
        <FormGroup errorText={validationErrors && validationErrors.action}>
          <label className="usa-label" htmlFor="filedBy" id="action-label">
            Action
          </label>
          <input
            aria-describedby="action-label"
            className="usa-input"
            id="action"
            name="form.action"
            type="text"
            value={form.action || ''}
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketRecordSequence();
            }}
          />
        </FormGroup>
        <FormGroup errorText={validationErrors && validationErrors.servedAt}>
          <label
            className="usa-label"
            htmlFor="servedAt"
            id="document-served-at-label"
          >
            Served
          </label>
          <input
            area-describedby="document-served-at-label"
            className="usa-input"
            id="servedAt"
            name="form.servedAt"
            type="text"
            value={form.servedAt || ''}
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketRecordSequence();
            }}
          />
        </FormGroup>
        <FormGroup
          errorText={validationErrors && validationErrors.servedParties}
        >
          <label
            className="usa-label"
            htmlFor="servedParties"
            id="document-served-parties-label"
          >
            Parties
          </label>
          <input
            area-describedby="document-served-parties-label"
            className="usa-input"
            defaultValue={form.servedParties}
            id="servedParties"
            name="form.servedParties"
            type="text"
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketRecordSequence();
            }}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);
