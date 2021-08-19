import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { StrikeDocketEntryModal } from './StrikeDocketEntryModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaTabAction = connect(
  {
    editDocketEntryMetaHelper: state.editDocketEntryMetaHelper,
    form: state.form,
    openStrikeDocketEntryModalSequence:
      sequences.openStrikeDocketEntryModalSequence,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.modal.validationErrors,
    validationSequence: sequences.validateDocumentSequence,
  },
  function EditDocketEntryMetaTabAction({
    editDocketEntryMetaHelper,
    form,
    openStrikeDocketEntryModalSequence,
    showModal,
    updateFormValueSequence,
    validationErrors,
    validationSequence,
  }) {
    return (
      <div className="blue-container">
        <FormGroup errorText={validationErrors?.action}>
          <label className="usa-label" htmlFor="action" id="action-label">
            Action
          </label>
          <input
            aria-describedby="action-label"
            className="usa-input"
            id="action"
            name="action"
            type="text"
            value={form.action || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validationSequence();
            }}
          />
        </FormGroup>
        <FormGroup>
          {editDocketEntryMetaHelper.isStricken && (
            <>
              <Icon
                aria-label="stricken docket record"
                className="margin-right-1 icon-sealed"
                icon="strikethrough"
                size="1x"
              />
              Stricken by {editDocketEntryMetaHelper.strickenBy} on{' '}
              {editDocketEntryMetaHelper.strickenAtFormatted}
            </>
          )}
          {!editDocketEntryMetaHelper.isStricken && (
            <Button
              link
              className="text-secondary-dark"
              icon={['fas', 'strikethrough']}
              iconColor="red"
              onClick={() => {
                openStrikeDocketEntryModalSequence();
              }}
            >
              Strike Entry
            </Button>
          )}
          {showModal === 'StrikeDocketEntryModal' && (
            <StrikeDocketEntryModal confirmSequence="strikeDocketEntrySequence" />
          )}
        </FormGroup>
      </div>
    );
  },
);
