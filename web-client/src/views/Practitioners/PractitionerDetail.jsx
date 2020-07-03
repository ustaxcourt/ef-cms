import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '../SuccessNotification';
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
                <span className="usa-tag">
                  {practitionerDetailHelper.admissionsStatus}
                </span>
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
            <div className="grid-col-9">
              <SuccessNotification />
            </div>
            {practitionerDetailHelper.showEditLink && (
              <div className="grid-col-3">
                <Button
                  link
                  className="push-right margin-bottom-1"
                  href={`/users/edit-practitioner/${practitionerDetailHelper.barNumber}`}
                  icon="edit"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-4 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Practitioner Information</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-name"
                        >
                          Practitioner name
                        </span>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.name}
                        </div>
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Practitioner type
                        </span>
                        {practitionerDetailHelper.practitionerType}
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-birth-year"
                        >
                          Birth year
                        </span>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.birthYear}
                        </div>
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-employer"
                        >
                          Employer
                        </span>
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
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-name"
                        >
                          Firm name
                        </span>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.firmNameFormatted}
                        </div>
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Phone number
                        </span>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.contact.phone}
                        </div>
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Email address
                        </span>
                        {practitionerDetailHelper.email}
                        {practitionerDetailHelper.hasEAccess && (
                          <FontAwesomeIcon
                            className="margin-left-05 fa-icon-blue"
                            icon="flag"
                            size="1x"
                          />
                        )}
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-name"
                        >
                          Address
                        </span>
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
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Additional phone number
                        </span>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.additionalPhone}
                        </div>
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="practitioner-practitioner-type"
                        >
                          Alternate email address
                        </span>
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
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Bar number
                          </span>
                          {practitionerDetailHelper.barNumber}
                        </div>
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Admission status
                          </span>
                          {practitionerDetailHelper.admissionsStatus}
                        </div>
                      </div>
                    </div>
                    <div className="tablet:grid-col-8 margin-bottom-1">
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Original bar state
                          </span>
                          {practitionerDetailHelper.originalBarState}
                        </div>
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="practitioner-birth-year"
                          >
                            Admission date
                          </span>
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
