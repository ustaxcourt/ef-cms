import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { OtherStatisticsForm } from './OtherStatisticsForm';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddOtherStatistics = connect(
  {
    cancelAddStatisticSequence: sequences.cancelAddStatisticSequence,
    submitAddOtherStatisticsSequence:
      sequences.submitAddOtherStatisticsSequence,
  },
  function AddOtherStatistics({
    cancelAddStatisticSequence,
    submitAddOtherStatisticsSequence,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-1" />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <h1>Add Other Statistics</h1>

          <div className="blue-container margin-bottom-5">
            <OtherStatisticsForm />
          </div>

          <div className="margin-top-3">
            <Button
              onClick={() => {
                submitAddOtherStatisticsSequence();
              }}
            >
              Save
            </Button>

            <Button link onClick={() => cancelAddStatisticSequence()}>
              Cancel
            </Button>
          </div>
        </section>
      </>
    );
  },
);

AddOtherStatistics.displayName = 'AddOtherStatistics';
