import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerDetail = connect(
  {
    practitionerDetail: state.practitionerDetail,
  },
  function PractitionerDetail({ practitionerDetail }) {
    return (
      <React.Fragment>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-12">
                <h1 className="captioned" tabIndex="-1">
                  {practitionerDetail.name}
                </h1>
                <span className="usa-tag">Active</span>
              </div>
            </div>
            <div className="grid-row">
              <div className="tablet:grid-col-12">[ Bar Number]</div>
            </div>
          </div>
        </div>

        <div className="grid-container">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-4 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Practitioner Information</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-name"
                        >
                          Practitioner name
                        </label>
                        <div className="margin-bottom-4">
                          {practitionerDetail.name}
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Practitioner type
                        </label>
                        [ Practitioner Type ]
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-birth-year"
                        >
                          Birth year
                        </label>
                        <div className="margin-bottom-4">[ Birth Year ]</div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-employer"
                        >
                          Employer
                        </label>
                        [ Employer ]
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tablet:grid-col-8 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Contact Information</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-name"
                        >
                          Firm name
                        </label>
                        <div className="margin-bottom-4">[ Firm Name ]</div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Phone number
                        </label>
                        <div className="margin-bottom-4">
                          {practitionerDetail.contact.phone}
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Email address
                        </label>
                        {practitionerDetail.email}
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-name"
                        >
                          Address
                        </label>
                        <div className="margin-bottom-4">[ Address ]</div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Additional phone number
                        </label>
                        <div className="margin-bottom-4">
                          [ Additional Phone Number ]
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Alternate email address
                        </label>
                        [ Alternate Email Address ]
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-12 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Admissions Information</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-4 margin-bottom-1">
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Bar number
                          </label>
                          {practitionerDetail.barNumber}
                        </div>
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Admission status
                          </label>
                          [ Admission Status ]
                        </div>
                      </div>
                    </div>
                    <div className="tablet:grid-col-8 margin-bottom-1">
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Original bar state
                          </label>
                          [ Original Bar State ]
                        </div>
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Admission date
                          </label>
                          [ Admission Date ]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
