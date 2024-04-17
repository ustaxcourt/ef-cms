import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerDetails = connect(
  {
    gotoPrintPractitionerCasesSequence:
      sequences.gotoPrintPractitionerCasesSequence,
    practitionerDetailHelper: state.practitionerDetailHelper,
    showModal: state.modal.showModal,
  },
  function PractitionerDetails({
    gotoPrintPractitionerCasesSequence,
    practitionerDetailHelper,
  }) {
    return (
      <React.Fragment>
        <div className="display-flex flex-justify-end">
          {practitionerDetailHelper.showEditLink && (
            <Button
              link
              className="push-right margin-bottom-1"
              data-testid="edit-practitioner-button"
              href={`/users/edit-practitioner/${practitionerDetailHelper.barNumber}`}
              icon="edit"
            >
              Edit
            </Button>
          )}
          {practitionerDetailHelper.showPrintCaseListLink && (
            <Button
              link
              className="push-right margin-bottom-1"
              data-testid="print-practitioner-case-list"
              icon="print"
              overrideMargin={true}
              onClick={() => {
                gotoPrintPractitionerCasesSequence({
                  userId: practitionerDetailHelper.userId,
                });
              }}
            >
              Print case list
            </Button>
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
                      <span className="usa-label usa-label-display">
                        Practitioner name
                      </span>
                      <div className="margin-bottom-4">
                        {practitionerDetailHelper.name}
                      </div>
                      <span className="usa-label usa-label-display">
                        Practitioner type
                      </span>
                      {practitionerDetailHelper.practitionerType}
                    </div>
                  </div>
                  <div className="tablet:grid-col-6 margin-bottom-1">
                    <div className="tablet:margin-bottom-0 margin-bottom-205">
                      <span className="usa-label usa-label-display">
                        Birth year
                      </span>
                      <div className="margin-bottom-4">
                        {practitionerDetailHelper.birthYear}
                      </div>
                      <span className="usa-label usa-label-display">
                        Practice type
                      </span>
                      {practitionerDetailHelper.practiceType}
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
                      <span className="usa-label usa-label-display">
                        Firm name
                      </span>
                      <div className="margin-bottom-4">
                        {practitionerDetailHelper.firmNameFormatted}
                      </div>
                      <span className="usa-label usa-label-display">
                        Phone number
                      </span>
                      <div className="margin-bottom-4">
                        {practitionerDetailHelper.contact.phone}
                      </div>
                      <span className="usa-label usa-label-display">
                        Email address
                      </span>
                      {practitionerDetailHelper.emailFormatted && (
                        <div className="margin-bottom-2">
                          {practitionerDetailHelper.emailFormatted}
                        </div>
                      )}
                      {practitionerDetailHelper.pendingEmailFormatted && (
                        <div data-testid="pending-practitioner-email">
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
                      <span className="usa-label usa-label-display">
                        Address
                      </span>
                      <div className="margin-bottom-4">
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
                      <span className="usa-label usa-label-display">
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
                      <span className="usa-label usa-label-display">
                        Bar number
                      </span>
                      <div className="margin-bottom-4">
                        {practitionerDetailHelper.barNumber}
                      </div>
                      <span className="usa-label usa-label-display">
                        Original bar state
                      </span>
                      {practitionerDetailHelper.originalBarState}
                    </div>
                  </div>
                  <div className="tablet:grid-col-6 margin-bottom-1">
                    <div className="tablet:margin-bottom-0 margin-bottom-205">
                      <span className="usa-label usa-label-display">
                        Admission status
                      </span>
                      <div className="margin-bottom-4">
                        {practitionerDetailHelper.admissionsStatus}
                      </div>
                      <span className="usa-label usa-label-display">
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
      </React.Fragment>
    );
  },
);

PractitionerDetails.displayName = 'PractitionerDetails';
