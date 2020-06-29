import { AddressDisplay } from './AddressDisplay';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

const OtherFilerInformation = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function OtherFilerInformation({ formattedCaseDetail }) {
    return (
      <>
        {formattedCaseDetail.otherFilers.length === 0 && (
          <div>There are no other filers in this case.</div>
        )}
        {formattedCaseDetail.otherFilers.length > 0 && (
          <div className="subsection party-information">
            <div className="grid-row grid-gap-6">
              <div className="tablet:grid-col-12">
                <div className="card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined" id="primary-label">
                      Other Filer Info
                    </h3>
                    {formattedCaseDetail.contactPrimary && (
                      <div className="grid-row">
                        <div className="grid-col-6">
                          <address aria-labelledby="primary-label">
                            <AddressDisplay
                              contact={formattedCaseDetail.contactPrimary}
                              nameOverride={
                                formattedCaseDetail.showCaseTitleForPrimary &&
                                formattedCaseDetail.caseTitle
                              }
                              showEmail={true}
                            />
                          </address>
                          {formattedCaseDetail.contactPrimary
                            .serviceIndicator && (
                            <div className="margin-top-4">
                              <p className="semi-bold margin-bottom-0">
                                Service preference
                              </p>
                              {
                                formattedCaseDetail.contactPrimary
                                  .serviceIndicator
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>{' '}
          </div>
        )}
      </>
    );
  },
);

export { OtherFilerInformation };
