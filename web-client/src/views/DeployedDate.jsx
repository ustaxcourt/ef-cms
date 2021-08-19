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
      const deployedAt =
        window.document.getElementById('last-deployed').content;
      setDisplayDate(deployedAt);
    }, []);

    return (
      <>
        {showDeployedDate && displayDate && (
          <div id="react-deployed-date">Deployed {displayDate}</div>
        )}
      </>
    );
  },
);
