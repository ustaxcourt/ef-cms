import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Statistics = connect(
  {
    caseDetail: state.caseDetail,
  },
  function Statistics({ caseDetail }) {
    return (
      <>
        <div>
          <Button link className="push-right padding-0" icon="plus-circle">
            Add Deficiency Statistics
          </Button>
          <Button link className="push-right padding-0" icon="plus-circle">
            Add Other Statistics
          </Button>
        </div>
        {caseDetail.statistics.length === 0 && (
          <p>There are no statistics for this case.</p>
        )}
      </>
    );
  },
);
