import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PendingMotion = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
  },
  function PendingMotion({ navigateToPathSequence }) {
    return (
      <>
        <span>
          Showing motions pending for more than 180 days. To view all, run the{' '}
          <Button
            link
            onClick={() =>
              navigateToPathSequence({
                path: '/reports/pending-report',
              })
            }
          >
            Pending Report.
          </Button>
        </span>
      </>
    );
  },
);

PendingMotion.displayName = 'PendingMotion';
