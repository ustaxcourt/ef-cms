import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerDetail = connect(
  {
    practitionerDetailHelper: state.practitionerDetailHelper,
  },
  function PractitionerDetail({ practitionerDetailHelper }) {
    return (
      <React.Fragment>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-12">
                <h1 className="captioned" tabIndex="-1">
                  {practitionerDetailHelper.name}
                </h1>
                <span className="usa-tag">Active</span>
              </div>
            </div>
            <div className="grid-row">
              <div className="tablet:grid-col-12">
                {practitionerDetailHelper.barNumber}
              </div>
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
                          {practitionerDetailHelper.name}
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Practitioner type
                        </label>
                        {practitionerDetailHelper.practitionerType}
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
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.birthYear}
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-employer"
                        >
                          Employer
                        </label>
                        {practitionerDetailHelper.employer}
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
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.employer}
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Phone number
                        </label>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.contact.phone}
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Email address
                        </label>
                        {practitionerDetailHelper.email}
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
                        <div className="margin-bottom-4">
                          {/* TODO: use helper (international) */}
                          {practitionerDetailHelper.contact.address1}
                          {practitionerDetailHelper.contact.address2 && (
                            <>
                              <div className="margin-top-1">
                                {practitionerDetailHelper.contact.address2}
                              </div>
                            </>
                          )}
                          {practitionerDetailHelper.contact.address3 && (
                            <>
                              <div className="margin-top-1">
                                {practitionerDetailHelper.contact.address3}
                              </div>
                            </>
                          )}
                          <div className="margin-top-1">
                            {practitionerDetailHelper.contact.city},{' '}
                            {practitionerDetailHelper.contact.state}{' '}
                            {practitionerDetailHelper.contact.postalCode}
                          </div>
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Additional phone number
                        </label>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.additionalPhone}
                        </div>
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Alternate email address
                        </label>
                        {practitionerDetailHelper.alternateEmail}
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
                          {practitionerDetailHelper.barNumber}
                        </div>
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Admission status
                          </label>
                          {practitionerDetailHelper.admissionsStatus}
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
                          {practitionerDetailHelper.originalBarState}
                        </div>
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Admission date
                          </label>
                          {practitionerDetailHelper.admissionsDateFormatted}
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
