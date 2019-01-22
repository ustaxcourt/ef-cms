import React from 'react';

import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
  },
  function PartyInformation({ caseDetail }) {
    return (
      <div className="subsection party-information">
        <h3 className="underlined">Party Information</h3>
        <div className="usa-grid-full">
          <div className="usa-width-two-thirds">
            <div className="usa-width-two-thirds">
              {caseDetail.petitioners && (
                <React.Fragment>
                  <p className="label" id="petitioners-label">
                    Petitioner
                  </p>
                  <div>
                    {caseDetail.petitioners.map((petitioner, key) => (
                      <address aria-labelledby="petitioners-label" key={key}>
                        <p>{petitioner.name}</p>
                        <p>
                          <span className="address-line">
                            {petitioner.addressLine1}
                          </span>
                          <span className="address-line">
                            {petitioner.addressLine2}
                          </span>
                          <span className="address-line">
                            {petitioner.city}, {petitioner.state}{' '}
                            {petitioner.zip}
                          </span>
                        </p>
                        <p>{petitioner.phone}</p>
                        <p>{petitioner.email}</p>
                      </address>
                    ))}
                  </div>
                </React.Fragment>
              )}{' '}
            </div>
            <div className="usa-width-one-third">
              {caseDetail.respondent && (
                <React.Fragment>
                  <p className="label" id="respondent-label">
                    Respondent
                  </p>
                  <address aria-labelledby="respondent-label">
                    <p>{caseDetail.respondent.formattedName}</p>
                    <p>
                      <span className="address-line">
                        {caseDetail.respondent.addressLine1}
                      </span>
                      <span className="address-line">
                        {caseDetail.respondent.addressLine2}
                      </span>
                      <span className="address-line">
                        {caseDetail.respondent.city},{' '}
                        {caseDetail.respondent.state}{' '}
                        {caseDetail.respondent.zip}
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
      </div>
    );
  },
);
