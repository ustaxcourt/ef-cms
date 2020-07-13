import { Button } from '../../ustc-ui/Button/Button';
import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { DeficiencyStatisticsForm } from './DeficiencyStatisticsForm';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDeficiencyStatistic = connect(
  {
    calculatePenaltiesForAddSequence:
      sequences.calculatePenaltiesForAddSequence,
    cancelAddStatisticSequence: sequences.cancelAddStatisticSequence,
    editStatisticFormHelper: state.editStatisticFormHelper,
    openConfirmDeleteDeficiencyStatisticsModalSequence:
      sequences.openConfirmDeleteDeficiencyStatisticsModalSequence,
    showModal: state.modal.showModal,
    submitEditDeficiencyStatisticSequence:
      sequences.submitEditDeficiencyStatisticSequence,
    validateAddDeficiencyStatisticsSequence:
      sequences.validateAddDeficiencyStatisticsSequence,
  },
  function EditDeficiencyStatistic({
    calculatePenaltiesForAddSequence,
    cancelAddStatisticSequence,
    editStatisticFormHelper,
    openConfirmDeleteDeficiencyStatisticsModalSequence,
    showModal,
    submitEditDeficiencyStatisticSequence,
    validateAddDeficiencyStatisticsSequence,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-1" />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <h1>
            Edit Year/Period - {editStatisticFormHelper.headerDateDisplay}
          </h1>

          <div className="blue-container margin-bottom-5 add-deficiency-statistics-form">
            <DeficiencyStatisticsForm />
            {editStatisticFormHelper.showDelete && (
              <div className="text-align-right">
                <Button
                  link
                  className="red-warning"
                  icon="trash"
                  onClick={() =>
                    openConfirmDeleteDeficiencyStatisticsModalSequence()
                  }
                >
                  Delete Year/Period
                </Button>
              </div>
            )}
          </div>

          <div className="margin-top-3">
            <Button
              onClick={() => {
                submitEditDeficiencyStatisticSequence();
              }}
            >
              Save
            </Button>

            <Button link onClick={() => cancelAddStatisticSequence()}>
              Cancel
            </Button>
          </div>
        </section>
        {showModal === 'CalculatePenaltiesModal' && (
          <CalculatePenaltiesModal
            confirmSequenceOverride={async () => {
              await calculatePenaltiesForAddSequence();
              await validateAddDeficiencyStatisticsSequence();
            }}
          />
        )}
        {showModal === 'ConfirmDeleteDeficiencyStatisticsModal' && (
          <ConfirmModal
            cancelLabel="Cancel"
            confirmLabel="Yes, Delete"
            title="Confirm Delete Year/Period"
            onCancelSequence="clearModalSequence"
            onConfirmSequence="deleteDeficiencyStatisticsSequence"
          >
            Are you sure you want to delete the year/period?
          </ConfirmModal>
        )}
      </>
    );
  },
);
