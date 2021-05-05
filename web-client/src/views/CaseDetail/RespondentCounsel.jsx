import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

const RespondentCounsel = connect(
  {
    caseDetail: state.caseDetail,
  },
  function RespondentCounsel({ caseDetail }) {
    return (
      <>
        <h2>Respondent Counsel</h2>
        <div className="grid-row grid-gap-2">
          {caseDetail.irsPractitioners.map(irsPractitioner => (
            <div
              className="grid-col-5 margin-bottom-4"
              key={irsPractitioner.userId}
            >
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper parties-card">
                  <h3>
                    {irsPractitioner.name} {`(${irsPractitioner.barNumber})`}
                    <Button
                      link
                      className="margin-top-1 padding-0 margin-right-05 float-right"
                      href={`/case-detail/${caseDetail.docketNumber}/edit-respondent-counsel/${irsPractitioner.barNumber}`}
                      icon="edit"
                    >
                      Edit
                    </Button>
                  </h3>
                  <hr className="respondent-card-header" />
                  <AddressDisplay
                    contact={{
                      ...irsPractitioner.contact,
                      name: undefined,
                    }}
                    showEmail={true}
                  />
                  {irsPractitioner.serviceIndicator && (
                    <div className="margin-top-4">
                      <p className="semi-bold margin-bottom-0">
                        Service preference
                      </p>
                      {irsPractitioner.serviceIndicator}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  },
);

export { RespondentCounsel };
