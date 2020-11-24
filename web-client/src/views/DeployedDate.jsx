import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect, useState } from 'react';

export const DeployedDate = connect(
  {
    showDeployedDate: state.templateHelper.showDeployedDate,
  },
  function DeployedDate({ showDeployedDate }) {
    const [displayDate, setDisplayDate] = useState(null);

    useEffect(() => {
      const deployedAt = document.getElementById('last-deployed').innerText;
      setDisplayDate(deployedAt);
    }, []);

    return (
      <>
        {showDeployedDate && displayDate && (
          <div
            className="grid-container position-fixed bottomn-0 right-0"
            id="react-deployed-date"
          >
            {displayDate}
          </div>
        )}
      </>
    );
  },
);
