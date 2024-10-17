import { DateRangePickerComponent } from '@web-client/ustc-ui/DateInput/DateRangePickerComponent';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from './ModalDialog';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

export const CreateTermModal = connect(
  {
    cancelSequence: sequences.clearModalFormSequence,
    confirmSequence: sequences.submitCreateTermModalSequence,
    modal: state.modal,
    todaysDate: state.todaysDate,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validationErrors: state.validationErrors,
  },
  function CreateTermModal({
    cancelSequence,
    confirmSequence,
    modal,
    todaysDate,
    updateModalValueSequence,
    validationErrors,
  }) {
    const [isModalMounted, setIsModalMounted] = useState(false);

    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="create-term-modal"
        confirmLabel="Create Term"
        confirmSequence={confirmSequence}
        title="Create Term"
        onModalMount={() => setIsModalMounted(true)}
      >
        <FormGroup errorText={validationErrors.termName}>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="display-block" id="trial-term">
              Term name
            </legend>
            <input
              className="usa-input term-name-field"
              data-testid="term-name-field"
              id="term-name-field"
              name="termName"
              type="text"
              value={modal.termName}
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </fieldset>
        </FormGroup>

        <FormGroup>
          <DateRangePickerComponent
            endDateErrorText={validationErrors.termEndDate}
            endLabel="Term end date"
            endName="termEndDate"
            endPickerCls={'grid-col-6'}
            endValue={modal.termEndDate}
            formGroupCls="margin-bottom-0"
            minDate={calculateISODate({
              dateString: todaysDate,
              howMuch: 1,
              units: 'days',
            })}
            parentModalHasMounted={isModalMounted}
            rangePickerCls={'grid-row grid-gap'}
            startDateErrorText={validationErrors.termStartDate}
            startLabel="Term start date"
            startName="termStartDate"
            startPickerCls={'grid-col-6'}
            startValue={modal.termStartDate}
            onChangeEnd={e => {
              updateModalValueSequence({
                key: 'termEndDate',
                value: e.target.value,
              });
            }}
            onChangeStart={e => {
              updateModalValueSequence({
                key: 'termStartDate',
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      </ModalDialog>
    );
  },
);

CreateTermModal.displayName = 'CreateTermModal';
