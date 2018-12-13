import React from 'react';

import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export default connect(
  {
    caseDetail: state.caseDetail,
  },
  function PartyInformation({ caseDetail }) {
    return (
      <div className="subsection">
        <div className="usa-font-lead">Party Information</div>
        <div className="usa-grid-full">
          <div className="usa-width-one-half">
            {caseDetail.petitioners && (
              <React.Fragment>
                <b id="petitioners-label">Petitioner</b>
                <div aria-labelledby="petitioners-label">
                  {caseDetail.petitioners.map((petitioner, key) => (
                    <address key={key} aria-labelledby={'pn-' + key}>
                      <p id={'pn-' + key}>{petitioner.name}</p>
                      <p>
                        {petitioner.addressLine1}
                        <br />
                        {petitioner.addressLine2}
                        <br />
                        {petitioner.city} {petitioner.state} {petitioner.zip}
                      </p>
                      <p>{petitioner.phone}</p>
                      <p>{petitioner.email}</p>
                    </address>
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="usa-width-one-half">
            {caseDetail.respondent && (
              <React.Fragment>
                <b id="respondent-label">Respondent</b>
                <address aria-labelledby="respondent-label">
                  {caseDetail.respondent.name} <br />
                  <br />
                  {caseDetail.respondent.address} <br />
                  {caseDetail.respondent.city} {caseDetail.respondent.state}{' '}
                  {caseDetail.respondent.zip} <br />
                  <br />
                  {caseDetail.respondent.phone} <br />
                  <br />
                  {caseDetail.respondent.email} <br />
                </address>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  },
);
