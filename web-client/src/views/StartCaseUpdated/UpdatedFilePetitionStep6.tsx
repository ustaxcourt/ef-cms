import { CaseInformation } from './CaseInformation';
import { CounselInformation } from '@web-client/views/StartCaseUpdated/CounselInformation';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FileUploadErrorModal } from '@web-client/views/FileUploadErrorModal';
import { FileUploadStatusModal } from '@web-client/views/FileUploadStatusModal';
import { IRSNoticeInformation } from './IRSNoticeInformation';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import {
  PETITION_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { PetitionInformation } from './PetitionInformation';
import { PetitionerInformation } from './PetitionerInformation';
import { STINInformation } from './STINInformation';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionStep6 = connect(
  {
    form: state.form,
    petitionFormatted: state.petitionFormatted,
    showModal: state.modal.showModal,
    user: state.user,
  },

  function UpdatedFilePetitionStep6({
    form,
    petitionFormatted,
    showModal,
    user,
  }) {
    const isAutoGenerated = form.petitionType === PETITION_TYPES.autoGenerated;
    const isPrivatePractitioner = user.role === ROLES.privatePractitioner;
    const isPetitioner = user.role === ROLES.petitioner;
    return (
      <>
        <ErrorNotification />
        <div>
          <div>
            <p className="margin-top-0">
              Review the information to make sure it is accurate. If you want to
              make a change, use the Back button at the bottom or Edit link in
              each section. You will not be able to make changes to your case
              once you create it without filing a motion.
            </p>
            <InfoNotificationComponent
              alertInfo={{
                message:
                  'Your Petition will not be created with the Court until the Submit Documents & Create Case button is clicked.',
              }}
              dismissible={false}
              scrollToTop={false}
            />
            <div className="padding-x-0">
              <div>
                {isAutoGenerated && isPrivatePractitioner && (
                  <div data-testid="petition-review-counsel-information">
                    <CounselInformation userInfo={user} />
                  </div>
                )}
                <div>
                  <PetitionerInformation
                    isPetitioner={isPetitioner}
                    petitionFormatted={petitionFormatted}
                  />
                </div>
                <div>
                  <PetitionInformation
                    isAutoGenerated={isAutoGenerated}
                    petitionFormatted={petitionFormatted}
                  />
                </div>
                <div>
                  <IRSNoticeInformation petitionFormatted={petitionFormatted} />
                </div>
                <div>
                  <CaseInformation petitionFormatted={petitionFormatted} />
                </div>
                <div>
                  <STINInformation petitionFormatted={petitionFormatted} />
                </div>
              </div>
            </div>

            <div className="margin-bottom-5">
              <div className="bg-white submit-reminders">
                <div className="card margin-top-2 margin-bottom-3">
                  <div className="content-header bg-accent-cool-dark text-white heading-3">
                    A Few Reminders Before You Submit
                  </div>
                  <div className="content-wrapper line-height-2">
                    <ol className="petitioner-review-list">
                      <li>
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
                          Additional documents may be submitted after your
                          Petition has been processed.
                        </b>
                      </li>
                      <li>
                        Confirm that all information being submitted appears as
                        you want it to appear.{' '}
                        <b>
                          After submitting your petition to the Court, you will
                          only be able to make changes by filing a motion.
                        </b>
                      </li>
                    </ol>
                  </div>
                </div>
                <WarningNotificationComponent
                  alertWarning={{
                    message:
                      'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or blocked out (redacted) from every form except the Statement of Taxpayer Identification Number.',
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />

                <div className="margin-top-4">
                  <UpdatedFilePetitionButtons primaryLabel="Submit Documents & Create Case" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && <FileUploadErrorModal />}
      </>
    );
  },
);
