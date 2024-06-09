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
    cancelAddStatisticSequence: sequences.cancelAddStatisticSequence,
    showModal: state.modal.showModal,
    submitAddDeficiencyStatisticsSequence:
      sequences.submitAddDeficiencyStatisticsSequence,
  },
  function AddDeficiencyStatistics({
    cancelAddStatisticSequence,
    showModal,
    submitAddDeficiencyStatisticsSequence,
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
        {showModal === 'CalculatePenaltiesModal' && <CalculatePenaltiesModal />}
      </>
    );
  },
);

AddDeficiencyStatistics.displayName = 'AddDeficiencyStatistics';
