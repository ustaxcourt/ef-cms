import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Statistics = connect(
  {
    formattedStatistics: state.formattedStatistics,
  },
  function Statistics({ formattedStatistics }) {
    return (
      <>
        <div>
          <Button link className="push-right padding-0" icon="plus-circle">
            Add Other Statistics
          </Button>
          <Button link className="push-right padding-0" icon="plus-circle">
            Add Deficiency Statistics
          </Button>
        </div>
        {!formattedStatistics && <p>There are no statistics for this case.</p>}
      </>
    );
  },
);
