import { AddressDisplay } from './AddressDisplay';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const OtherFilerInformation = connect(
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
                    <div className="grid-row">
                      {formattedCaseDetail.otherFilers.map(
                        (otherFiler, idx) => {
                          return (
                            <div
                              className={classNames(
                                'grid-col-3',
                                idx > 3 && 'margin-top-4',
                              )}
                              key={idx}
                            >
                              <address aria-labelledby="primary-label">
                                <AddressDisplay
                                  contact={otherFiler}
                                  nameOverride={`${otherFiler.name}, ${otherFiler.otherFilerType}`}
                                  showEmail={true}
                                />
                              </address>
                              {otherFiler.serviceIndicator && (
                                <div className="margin-top-4">
                                  <p className="semi-bold margin-bottom-0">
                                    Service preference
                                  </p>
                                  {otherFiler.serviceIndicator}
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
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
