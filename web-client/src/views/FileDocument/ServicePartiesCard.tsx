import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ServicePartiesCard = connect(
  {
    externalConsolidatedCaseGroupHelper:
      state.externalConsolidatedCaseGroupHelper,
  },
  function ServicePartiesCard({ externalConsolidatedCaseGroupHelper }) {
    return (
      <div className="tablet:grid-col-6 margin-bottom-4">
        <div className="card height-full margin-bottom-0">
          <div className="content-wrapper">
            <h3 className="underlined margin-bottom-0">Service Parties</h3>
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-12 margin-bottom-1">
                {externalConsolidatedCaseGroupHelper.consolidatedGroupServiceParties.map(
                  (partyGroup, index1) => (
                    <React.Fragment key={index1}>
                      <ul className="ustc-unstyled-list without-margins service-party-divider">
                        {Object.values(partyGroup).map(
                          (serviceParty, index2) => {
                            return <li key={index2}>{serviceParty}</li>;
                          },
                        )}
                      </ul>
                    </React.Fragment>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ServicePartiesCard.displayName = 'ServicePartiesCard';
