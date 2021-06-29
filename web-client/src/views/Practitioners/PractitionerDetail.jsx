import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OpenPractitionerCaseListPdfModal } from './OpenPractitionerCaseListPdfModal';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerDetail = connect(
  {
    gotoPrintPractitionerCasesSequence:
      sequences.gotoPrintPractitionerCasesSequence,
    practitionerDetailHelper: state.practitionerDetailHelper,
    showModal: state.modal.showModal,
  },
  function PractitionerDetail({
    gotoPrintPractitionerCasesSequence,
    practitionerDetailHelper,
    showModal,
  }) {
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
            <div className="grid-col-8">
              <SuccessNotification />
            </div>

            <div className="grid-col-4">
              {practitionerDetailHelper.showPrintCaseListLink && (
                <Button
                  link
                  className="push-right margin-bottom-1"
                  icon="print"
                  onClick={() => {
                    gotoPrintPractitionerCasesSequence({
                      userId: practitionerDetailHelper.userId,
                    });
                  }}
                >
                  Print case list
                </Button>
              )}
              {practitionerDetailHelper.showEditLink && (
                <Button
                  link
                  className="push-right margin-bottom-1"
                  href={`/users/edit-practitioner/${practitionerDetailHelper.barNumber}`}
                  icon="edit"
                >
                  Edit
                </Button>
              )}
            </div>
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
                        {practitionerDetailHelper.emailFormatted && (
                          <div className="margin-bottom-2">
                            {practitionerDetailHelper.emailFormatted}
                          </div>
                        )}
                        {practitionerDetailHelper.pendingEmailFormatted && (
                          <div>
                            {practitionerDetailHelper.pendingEmailFormatted}
                          </div>
                        )}
                        {practitionerDetailHelper.showEAccessFlag && (
                          <FontAwesomeIcon
                            className="margin-left-05 fa-icon-blue"
                            icon="flag"
                            size="1x"
                            title="has e-access"
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-5 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Admissions Information</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="admissions-bar-number"
                        >
                          Bar number
                        </span>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.barNumber}
                        </div>
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="original-bar-state"
                        >
                          Original bar state
                        </span>
                        {practitionerDetailHelper.originalBarState}
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="admissions-status"
                        >
                          Admission status
                        </span>
                        <div className="margin-bottom-4">
                          {practitionerDetailHelper.admissionsStatus}
                        </div>
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="admission-date"
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
            <div className="tablet:grid-col-7 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Practitioner Notes</h3>
                  <div className="tablet:grid-col-12 margin-bottom-1">
                    {practitionerDetailHelper.practitionerNotes}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showModal === 'OpenPractitionerCaseListPdfModal' && (
          <OpenPractitionerCaseListPdfModal />
        )}
      </React.Fragment>
    );
  },
);
