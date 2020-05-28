import { Button } from '../../ustc-ui/Button/Button';
import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseDetailHeader } from './CaseDetailHeader';
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
    form: state.form,
    showModal: state.modal.showModal,
    submitEditDeficiencyStatisticSequence:
      sequences.submitEditDeficiencyStatisticSequence,
    validateAddDeficiencyStatisticsSequence:
      sequences.validateAddDeficiencyStatisticsSequence,
  },
  function EditDeficiencyStatistic({
    calculatePenaltiesForAddSequence,
    form,
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

          <h1>Edit Year/Period - {form.year}</h1>

          <DeficiencyStatisticsForm />

          <div className="margin-top-3">
            <Button
              onClick={() => {
                submitEditDeficiencyStatisticSequence();
              }}
            >
              Save
            </Button>

            <Button link onClick={() => {}}>
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
