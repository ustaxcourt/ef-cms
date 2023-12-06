import { Button } from '../../ustc-ui/Button/Button';
import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { DeficiencyStatisticsForm } from './DeficiencyStatisticsForm';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddDeficiencyStatistics = connect(
  {
    calculatePenaltiesSequence: sequences.calculatePenaltiesSequence,
    cancelAddStatisticSequence: sequences.cancelAddStatisticSequence,
    showModal: state.modal.showModal,
    submitAddDeficiencyStatisticsSequence:
      sequences.submitAddDeficiencyStatisticsSequence,
    validateAddDeficiencyStatisticsSequence:
      sequences.validateAddDeficiencyStatisticsSequence,
  },
  function AddDeficiencyStatistics({
    calculatePenaltiesSequence,
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
            confirmSequenceOverride={async ({ penaltyAmountType }) => {
              await calculatePenaltiesSequence({ penaltyAmountType });
              await validateAddDeficiencyStatisticsSequence();
            }}
          />
        )}
      </>
    );
  },
);

AddDeficiencyStatistics.displayName = 'AddDeficiencyStatistics';
