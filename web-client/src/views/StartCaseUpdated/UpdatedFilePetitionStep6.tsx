import { ALL_STATE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FileUploadErrorModal } from '@web-client/views/FileUploadErrorModal';
import { FileUploadStatusModal } from '@web-client/views/FileUploadStatusModal';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep6 = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    pdfGeneratedUrl: state.pdfGeneratedUrl,
    pdfPreviewUrl: state.pdfPreviewUrl,
    petitionFormatted: state.petitionFormatted,
    showModal: state.modal.showModal,
    updatedFilePetitionCompleteStep6Sequence:
      sequences.updatedFilePetitionCompleteStep6Sequence,
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
    user: state.user,
  },

  function UpdatedFilePetitionStep6({
    form,
    formCancelToggleCancelSequence,
    pdfPreviewUrl,
    petitionFormatted,
    showModal,
    updatedFilePetitionCompleteStep6Sequence,
    updatedFilePetitionGoBackAStepSequence,
    user,
  }) {
    const isAutoGenerated = form.petitionType === PETITION_TYPES.autoGenerated;

    return (
      <>
        <ErrorNotification />
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <p className="margin-top-0">
              Review the Petition preview and uploaded documents to make sure
              all of the information is accurate. You will not be able to make
              changes to your case once you submit it without filing a motion.
            </p>
            <WarningNotificationComponent
              alertWarning={{
                message:
                  'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or blocked out (redacted) for every form except the Statement of Taxpayer Identification.',
              }}
              dismissible={false}
              scrollToTop={false}
            />
            <div className={classNames('grid-container padding-x-0')}>
              <div className="grid-row grid-gap">
                <div
                  className={classNames('margin-bottom-4', {
                    'tablet:grid-col-4': !isAutoGenerated,
                    'tablet:grid-col-12': isAutoGenerated,
                  })}
                >
                  <CaseInformation
                    pdfPreviewUrl={pdfPreviewUrl}
                    petitionFormatted={petitionFormatted}
                  />
                </div>

                <div
                  className={classNames('margin-bottom-4', {
                    'tablet:grid-col-8': !isAutoGenerated,
                    'tablet:grid-col-12': isAutoGenerated,
                  })}
                >
                  {isAutoGenerated ? (
                    <AutoGeneratedPetitionerInformation
                      petitionFormatted={petitionFormatted}
                      userEmail={user.email}
                    />
                  ) : (
                    <UploadedPetitionerInformation
                      petitionFormatted={petitionFormatted}
                      userEmail={user.email}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid-row grid-gap margin-bottom-5">
              <div className="tablet:grid-col-12 bg-white submit-reminders">
                <div className="card">
                  <div className="content-header bg-accent-cool-dark text-white heading-3">
                    A Few Reminders Before You Submit
                  </div>
                  <div className="content-wrapper">
                    <ol className="numbered-list">
                      <li>
                        Double check your IRS Notice to ensure your Petition is
                        timely.{' '}
                        <b>
                          In most cases, the Court must receive your
                          electronically filed Petition no later than 11:59 pm
                          Eastern Time on the last date to file.
                        </b>
                      </li>
                      <li>
                        Do not combine any additional documents with your
                        Petition.{' '}
                        <b>
                          Documents that might be evidence can be submitted at a
                          later time.
                        </b>
                      </li>
                      <li>
                        Confirm that all information being submitted appears as
                        you want it to appear.{' '}
                        <b>
                          After submitting your case to the Court, you will only
                          be able to make changes by filing a motion.
                        </b>
                      </li>
                    </ol>
                  </div>
                </div>
                <InfoNotificationComponent
                  alertInfo={{
                    message:
                      'This petition will not be filed with the Court until the Submit Documents & Create Case button is clicked.',
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />

                <div className="margin-top-4">
                  <Button
                    data-testid="petition-review-submit-document"
                    id="submit-document"
                    type="submit"
                    onClick={() => {
                      updatedFilePetitionCompleteStep6Sequence();
                    }}
                  >
                    Submit Documents & Create Case
                  </Button>
                  <Button
                    secondary
                    onClick={() => updatedFilePetitionGoBackAStepSequence()}
                  >
                    Back
                  </Button>
                  <Button
                    link
                    onClick={() => {
                      formCancelToggleCancelSequence();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {isAutoGenerated && (
            <NonMobile>
              <div className="grid-col">
                <span>
                  <b>Petition Preview</b>
                </span>
                <div
                  className="padding-top-1"
                  data-testid="petition-pdf-preview"
                >
                  <PdfPreview heightOverride={true} />
                </div>
              </div>
            </NonMobile>
          )}
        </div>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && <FileUploadErrorModal />}
      </>
    );
  },
);

function CaseInformation({ pdfPreviewUrl, petitionFormatted }) {
  return (
    <div className="card height-full margin-bottom-0">
      <div className="content-wrapper">
        <h3 className="underlined">About Your Case</h3>
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-6 margin-bottom-05">
            <div className="margin-bottom-2">
              <span className="usa-label usa-label-display">
                Type of notice/case
              </span>
              {petitionFormatted.caseType}
              <div className="grid-row margin-top-3">
                <div className="grid-col">
                  <span className="usa-label usa-label-display">Petition</span>
                  <div>
                    <div className="grid-row">
                      <div className="grid-col flex-auto">
                        <Button
                          link
                          className="usa-link--external text-left mobile-text-wrap"
                          href={pdfPreviewUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Preview in full screen
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-row margin-top-3">
                <div className="grid-col">
                  <span className="usa-label usa-label-display">
                    IRS notice(s)
                  </span>
                  {petitionFormatted.hasIrsNotice ? (
                    petitionFormatted.irsNotices.map(irsNotice => {
                      if (irsNotice.file?.name) {
                        return (
                          <div key={irsNotice.key}>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <Button
                                  link
                                  data-testid="atp-preview-button"
                                  href={irsNotice.irsNoticeFileUrl}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {irsNotice.file.name}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return <div key={irsNotice.key}>N/A</div>;
                      }
                    })
                  ) : (
                    <div>N/A</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="tablet:grid-col-6 margin-bottom-1">
            <span className="usa-label usa-label-display">Case procedure</span>
            {petitionFormatted.procedureType}
            <div className="margin-top-3">
              <span className="usa-label usa-label-display">
                Requested trial location
              </span>
              {petitionFormatted.preferredTrialCity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutoGeneratedPetitionerInformation({ petitionFormatted, userEmail }) {
  return (
    <div className="card height-full margin-bottom-0">
      <div className="content-wrapper">
        <h3 className="underlined">Petitioner Information</h3>
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-6">
            <span className="usa-label usa-label-display">Party type</span>
            {petitionFormatted.partyType}

            <div className="margin-top-3 margin-bottom-2">
              <span className="usa-label usa-label-display">
                Statement of Taxpayer Identification
              </span>
              <div>
                <div className="grid-row">
                  <div className="grid-col flex-auto">
                    <Button
                      link
                      data-testid="stin-preview-button"
                      href={petitionFormatted.stinFileUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {petitionFormatted.stinFile.name}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {petitionFormatted.corporateDisclosureFile && (
              <div className="grid-row margin-top-3">
                <span className="usa-label usa-label-display">
                  Corporate Disclosure Statement
                </span>
                <div>
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <Button
                        link
                        href={petitionFormatted.corporateDisclosureFileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {petitionFormatted.corporateDisclosureFile.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {petitionFormatted.contactSecondary && (
              <div className="grid-row margin-top-3">
                <span
                  className="usa-label usa-label-display margin-bottom-0"
                  id="filing-contact-primary"
                >
                  Petitioner contact information
                </span>
                {petitionFormatted.contactPrimary && (
                  <address aria-labelledby="filing-contact-primary">
                    <AddressDisplay
                      contact={petitionFormatted.contactPrimary}
                      noMargin={true}
                    />

                    <div className="display-flex-center margin-top-1">
                      <span className="font-weight-600">
                        Place of legal residence:
                      </span>
                      <span className="margin-left-5">
                        {
                          ALL_STATE_OPTIONS[
                            petitionFormatted.contactPrimary
                              .placeOfLegalResidence
                          ]
                        }
                      </span>
                    </div>
                  </address>
                )}

                <div className="margin-top-3 margin-bottom-2">
                  <span className="usa-label usa-label-display">
                    Service email
                  </span>
                  {userEmail}
                </div>
              </div>
            )}
          </div>

          <div className="tablet:grid-col-6 margin-bottom-1 party-information">
            {!petitionFormatted.contactSecondary && (
              <div className="grid-row">
                <span
                  className="usa-label usa-label-display margin-bottom-0"
                  id="filing-contact-primary"
                >
                  Petitioner contact information
                </span>
                {petitionFormatted.contactPrimary && (
                  <address aria-labelledby="filing-contact-primary">
                    <AddressDisplay
                      contact={petitionFormatted.contactPrimary}
                      noMargin={true}
                    />

                    <div className="display-flex-center margin-top-1">
                      <span className="font-weight-600">
                        Place of legal residence:
                      </span>
                      <span className="margin-left-5">
                        {
                          ALL_STATE_OPTIONS[
                            petitionFormatted.contactPrimary
                              .placeOfLegalResidence
                          ]
                        }
                      </span>
                    </div>
                  </address>
                )}

                <div className="margin-top-3 margin-bottom-2">
                  <span className="usa-label usa-label-display">
                    Service email
                  </span>
                  {userEmail}
                </div>
              </div>
            )}
            {petitionFormatted.contactSecondary && (
              <div className="grid-row">
                <>
                  <span
                    className="usa-label usa-label-display margin-bottom-0"
                    id="filing-contact-secondary"
                  >
                    {"Spouse's contact information"}
                  </span>
                  <address aria-labelledby="filing-contact-secondary">
                    <AddressDisplay
                      contact={petitionFormatted.contactSecondary}
                    />
                  </address>
                  <div className="margin-top-1 display-flex-center">
                    <span className="font-weight-600">
                      Register for eService/filing:
                    </span>
                    <span className="margin-left-5">
                      {petitionFormatted.contactSecondary.hasConsentedToEService
                        ? 'Yes'
                        : 'No'}
                    </span>
                  </div>
                  <div className="margin-top-1 display-flex-center">
                    <span className="font-weight-600">
                      Place of legal residence:
                    </span>
                    <span className="margin-left-5">
                      {
                        ALL_STATE_OPTIONS[
                          petitionFormatted.contactPrimary.placeOfLegalResidence
                        ]
                      }
                    </span>
                  </div>
                </>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadedPetitionerInformation({ petitionFormatted, userEmail }) {
  return (
    <div className="card height-full margin-bottom-0">
      <div className="content-wrapper">
        <h3 className="underlined">Petitioner Information</h3>
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-4">
            <span className="usa-label usa-label-display">Party type</span>
            {petitionFormatted.partyType}
            <div className="margin-top-3 margin-bottom-2">
              <span className="usa-label usa-label-display">
                Statement of Taxpayer Identification
              </span>
              <div>
                <div className="grid-row">
                  <div className="grid-col flex-auto">
                    <Button
                      link
                      data-testid="stin-preview-button"
                      href={petitionFormatted.stinFileUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {petitionFormatted.stinFile.name}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              'margin-bottom-1',
              'party-information',
              'tablet:grid-col-4',
            )}
          >
            <div className="grid-row">
              <span
                className="usa-label usa-label-display margin-bottom-0"
                id="filing-contact-primary"
              >
                Petitioner contact information
              </span>
              {petitionFormatted.contactPrimary && (
                <address aria-labelledby="filing-contact-primary">
                  <AddressDisplay
                    contact={petitionFormatted.contactPrimary}
                    noMargin={true}
                  />

                  <div className="margin-top-3 margin-bottom-2">
                    <span className="usa-label usa-label-display">
                      Service email
                    </span>
                    {userEmail}
                  </div>
                </address>
              )}
            </div>

            {petitionFormatted.corporateDisclosureFile && (
              <div className="margin-top-3 margin-bottom-2">
                <span className="usa-label usa-label-display">
                  Corporate Disclosure Statement
                </span>
                <div>
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <Button
                        link
                        href={petitionFormatted.corporateDisclosureFileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {petitionFormatted.corporateDisclosureFile.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className={classNames(
              'margin-bottom-1',
              'party-information',
              'tablet:grid-col-4',
            )}
          >
            {petitionFormatted.contactSecondary && (
              <div className="grid-row">
                <span
                  className="usa-label usa-label-display margin-bottom-0"
                  id="filing-contact-secondary"
                >
                  {"Spouse's contact information"}
                </span>
                <address aria-labelledby="filing-contact-secondary">
                  <AddressDisplay
                    contact={petitionFormatted.contactSecondary}
                  />
                </address>
                <div className="margin-top-1 display-flex-center">
                  <span className="font-weight-600">
                    Register for eService/filing:
                  </span>
                  <span className="margin-left-5">
                    {petitionFormatted.contactSecondary.hasConsentedToEService
                      ? 'Yes'
                      : 'No'}
                  </span>
                </div>
              </div>
            )}
            {petitionFormatted.corporateDisclosureFile && (
              <div className="margin-top-3 margin-bottom-2">
                <span className="usa-label usa-label-display">
                  Corporate Disclosure Statement
                </span>
                <div>
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <Button
                        link
                        href={petitionFormatted.corporateDisclosureFileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {petitionFormatted.corporateDisclosureFile.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
