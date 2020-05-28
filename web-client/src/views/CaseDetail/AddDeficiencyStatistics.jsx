import { Button } from '../../ustc-ui/Button/Button';
import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { DeficiencyStatisticsForm } from './DeficiencyStatisticsForm';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDeficiencyStatistics = connect(
  {
    calculatePenaltiesForAddSequence:
      sequences.calculatePenaltiesForAddSequence,
    cancelAddStatisticSequence: sequences.cancelAddStatisticSequence,
    showModal: state.modal.showModal,
    submitAddDeficiencyStatisticsSequence:
      sequences.submitAddDeficiencyStatisticsSequence,
    validateAddDeficiencyStatisticsSequence:
      sequences.validateAddDeficiencyStatisticsSequence,
  },
  function AddDeficiencyStatistics({
    calculatePenaltiesForAddSequence,
    cancelAddStatisticSequence,
    showModal,
    submitAddDeficiencyStatisticsSequence,
    validateAddDeficiencyStatisticsSequence,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-1" />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <h1>Add Year/Period</h1>

          <div className="blue-container margin-bottom-5 add-deficiency-statistics-form">
            <DeficiencyStatisticsForm />
          </div>

          <div className="margin-top-3">
            <Button
              onClick={() => {
                submitAddDeficiencyStatisticsSequence();
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
      </>
    );
  },
);
