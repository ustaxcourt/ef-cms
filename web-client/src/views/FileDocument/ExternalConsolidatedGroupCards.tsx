import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ExternalConsolidatedGroupCards = connect(
  {
    externalConsolidatedCaseGroupHelper:
      state.externalConsolidatedCaseGroupHelper,
  },
  function ExternalConsolidatedGroupCards({
    externalConsolidatedCaseGroupHelper,
  }) {
    return (
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-6 margin-bottom-4">
          <div className="card height-full margin-bottom-0">
            <div className="content-wrapper">
              <h3 className="underlined">
                Case(s) The Document(s) Will Be Filed In
              </h3>
              <div className="grid-row grid-gap">
                <div className="tablet:grid-col-12 margin-bottom-1">
                  <div className="tablet:margin-bottom-0 margin-bottom-205">
                    <h3 className="usa-label">
                      Docket numbers and petitioners
                    </h3>
                    <ul className="ustc-unstyled-consolidated-case-list padding-left-0">
                      {externalConsolidatedCaseGroupHelper.formattedConsolidatedCaseList.map(
                        (item, index) => (
                          <li className="margin-bottom-2" key={index}>
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                          {partyGroup.map((serviceParty, index2) => {
                            return <li key={index2}>{serviceParty}</li>;
                          })}
                        </ul>
                      </React.Fragment>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ExternalConsolidatedGroupCards.displayName = 'ExternalConsolidatedGroupCards';
