import { AddressDisplay } from './AddressDisplay';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const OtherFilerInformation = connect(
  {
    caseInformationHelper: state.caseInformationHelper,
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function OtherFilerInformation({
    caseInformationHelper,
    formattedCaseDetail,
  }) {
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
                    <div className="grid-row header-row">
                      <div
                        className="grid-col-6 display-flex"
                        id="other-filer-label"
                      >
                        <h3>Other Filer Info</h3>
                      </div>
                    </div>
                    <Mobile>
                      <div className="grid-row">
                        {formattedCaseDetail.otherFilers.map(otherFiler => {
                          return (
                            <div
                              className="grid-col-12 margin-top-1 margin-bottom-1"
                              key={`otherFilers-${otherFiler.name}`}
                            >
                              <address aria-labelledby="other-filer-label">
                                <AddressDisplay
                                  contact={otherFiler}
                                  nameOverride={`${otherFiler.name}, ${otherFiler.otherFilerType}`}
                                  noMargin={true}
                                  showEmail={true}
                                  showSealAddressLink={
                                    caseInformationHelper.showSealAddressLink
                                  }
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
                        })}
                      </div>
                    </Mobile>
                    <NonMobile>
                      <div className="grid-row">
                        {formattedCaseDetail.otherFilers.map(
                          (otherFiler, idx) => {
                            return (
                              <div
                                className={classNames(
                                  'grid-col-3',
                                  idx > 3 && 'margin-top-4',
                                )}
                                key={`otherFilers-${otherFiler.name}`}
                              >
                                <address aria-labelledby="other-filer-label">
                                  <AddressDisplay
                                    contact={otherFiler}
                                    nameOverride={`${otherFiler.name}, ${otherFiler.otherFilerType}`}
                                    showEmail={true}
                                    showSealAddressLink={
                                      caseInformationHelper.showSealAddressLink
                                    }
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
                    </NonMobile>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);
