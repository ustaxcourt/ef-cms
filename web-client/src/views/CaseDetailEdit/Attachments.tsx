import { Button } from '@web-client/ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PDFPreviewButton } from '@web-client/views/PDFPreviewButton';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Attachments = connect(
  {
    form: state.form,
    reviewSavedPetitionHelper: state.reviewSavedPetitionHelper,
  },
  function Attachments({ form, reviewSavedPetitionHelper }) {
    return (
      <div className="tablet:grid-col-5 margin-bottom-4">
        <div className="card height-full margin-bottom-0">
          <div className="content-wrapper">
            <h3 className="underlined" id="attachments-card">
              Attachments
              <Button
                link
                aria-label="edit parties"
                className="margin-right-0 margin-top-1 padding-0 float-right"
                href={`/case-detail/${form.docketNumber}/petition-qc?tab=partyInfo`}
                icon="edit"
              >
                Edit
              </Button>
            </h3>
            <div>
              {reviewSavedPetitionHelper.petitionFile && (
                <div className="margin-top-3 margin-bottom-2">
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <PDFPreviewButton
                        data-testid="petitionFileButton"
                        file={reviewSavedPetitionHelper.petitionFile}
                        title="Petition"
                      />
                    </div>
                  </div>
                </div>
              )}
              {reviewSavedPetitionHelper.stinFile && (
                <div
                  className="margin-top-3 margin-bottom-2"
                  data-testid="stinFileButton"
                >
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <FontAwesomeIcon
                        className="pdf-preview-btn padding-0"
                        icon={['fas', 'file-pdf']}
                        size="sm"
                      />
                      Statement of Taxpayer Identification
                    </div>
                  </div>
                </div>
              )}
              {!!reviewSavedPetitionHelper.attachmentToPetitionFiles.length &&
                reviewSavedPetitionHelper.attachmentToPetitionFiles.map(
                  atpFile => {
                    return (
                      <div
                        className="margin-top-3 margin-bottom-3"
                        key={`attachmentToPetitionFileButton-${atpFile.docketEntryId}`}
                      >
                        <div className="grid-row">
                          <div className="grid-col flex-auto">
                            <PDFPreviewButton
                              data-testid="attachmentToPetitionFileButton"
                              file={atpFile}
                              title="Attachment to Petition"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              {reviewSavedPetitionHelper.requestForPlaceOfTrialFile && (
                <div className="margin-top-3 margin-bottom-3">
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <PDFPreviewButton
                        data-testid="requestForPlaceOfTrialFileButton"
                        file={
                          reviewSavedPetitionHelper.requestForPlaceOfTrialFile
                        }
                        title="Request for Place of Trial"
                      />
                    </div>
                  </div>
                </div>
              )}
              {reviewSavedPetitionHelper.corporateDisclosureFile && (
                <div className="margin-top-3 margin-bottom-3">
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <PDFPreviewButton
                        data-testid="corporateDisclosureFileButton"
                        file={reviewSavedPetitionHelper.corporateDisclosureFile}
                        title="Corporate Disclosure Statement"
                      />
                    </div>
                  </div>
                </div>
              )}
              {reviewSavedPetitionHelper.applicationForWaiverOfFilingFeeFile && (
                <div className="margin-top-3 margin-bottom-3">
                  <div className="grid-row">
                    <div className="grid-col flex-auto">
                      <PDFPreviewButton
                        data-testid="applicationForWaiverOfFilingFeeFileButton"
                        file={
                          reviewSavedPetitionHelper.applicationForWaiverOfFilingFeeFile
                        }
                        title="Application for Waiver of Filing Fee"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Attachments.displayName = 'Attachments';
