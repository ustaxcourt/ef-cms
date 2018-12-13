import React from 'react';

import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export default connect(
  {
    caseDetail: state.caseDetail,
  },
  function PartyInformation({ caseDetail }) {
    return (
      <div className="subsection party-information">
        <h3>Party Information</h3>
        <div className="usa-grid-full">
          <div className="usa-width-one-half">
            {caseDetail.petitioners && (
              <React.Fragment>
                <h4>Petitioner</h4>
                {caseDetail.petitioners.map((petitioner, key) => (
                  <address key={key}>
                    <p>{petitioner.name}</p>
                    <p>
                      <span className="address-line">
                        {petitioner.addressLine1}
                      </span>
                      <span className="address-line">
                        {petitioner.addressLine2}
                      </span>
                      <span className="address-line">
                        {petitioner.city}, {petitioner.state} {petitioner.zip}
                      </span>
                    </p>
                    <p>{petitioner.phone}</p>
                    <p>{petitioner.email}</p>
                  </address>
                ))}
              </React.Fragment>
            )}
          </div>
          <div className="usa-width-one-half">
            {caseDetail.respondent && (
              <React.Fragment>
                <h4>Respondent</h4>
                <address>
                  <p>{caseDetail.respondent.name}</p>
                  <p>
                    <span className="address-line">
                      {caseDetail.respondent.addressLine1}
                    </span>
                    <span className="address-line">
                      {caseDetail.respondent.addressLine2}
                    </span>
                    <span className="address-line">
                      {caseDetail.respondent.city},{' '}
                      {caseDetail.respondent.state} {caseDetail.respondent.zip}
                    </span>
                  </p>
                  <p>{caseDetail.respondent.phone}</p>
                  <p>{caseDetail.respondent.email}</p>
                </address>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  },
);
