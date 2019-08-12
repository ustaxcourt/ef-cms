import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  {
    viewHelper: state.trialSessionWorkingCopyHelper,
  },
  ({ viewHelper }) => {
    return (
      <>
        <BigHeader text={viewHelper.title} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
        </section>
      </>
    );
  },
);
