import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { ErrorNotification } from '../ErrorNotification';
import { OtherStatisticsForm } from './OtherStatisticsForm';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditOtherStatistics = connect(
  {
    cancelAddStatisticSequence: sequences.cancelAddStatisticSequence,
    openConfirmDeleteOtherStatisticsModalSequence:
      sequences.openConfirmDeleteOtherStatisticsModalSequence,
    showModal: state.modal.showModal,
    submitEditOtherStatisticsSequence:
      sequences.submitEditOtherStatisticsSequence,
  },
  function EditOtherStatistics({
    cancelAddStatisticSequence,
    openConfirmDeleteOtherStatisticsModalSequence,
    showModal,
    submitEditOtherStatisticsSequence,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-1" />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <h1>Edit Other Statistics</h1>

          <div className="blue-container margin-bottom-5">
            <OtherStatisticsForm />
            <div className="text-align-right">
              <Button
                link
                className="red-warning"
                icon="trash"
                onClick={() => openConfirmDeleteOtherStatisticsModalSequence()}
              >
                Delete Other Statistics
              </Button>
            </div>
          </div>

          <div className="margin-top-3">
            <Button
              onClick={() => {
                submitEditOtherStatisticsSequence();
              }}
            >
              Save
            </Button>

            <Button link onClick={() => cancelAddStatisticSequence()}>
              Cancel
            </Button>
          </div>
        </section>

        {showModal === 'ConfirmDeleteOtherStatisticsModal' && (
          <ConfirmModal
            cancelLabel="Cancel"
            confirmLabel="Yes, Delete"
            title="Confirm Delete Other Statistics"
            onCancelSequence="clearModalSequence"
            onConfirmSequence="deleteOtherStatisticsSequence"
          >
            Are you sure you want to delete the other statistics?
          </ConfirmModal>
        )}
      </>
    );
  },
);

EditOtherStatistics.displayName = 'EditOtherStatistics';
