import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseDetailHeader } from '@web-client/views/CaseDetail/CaseDetailHeader';
import { EditDocketEntryMetaDocketEntryPreview } from './EditDocketEntryMetaDocketEntryPreview';
import { EditDocketEntryMetaFormCourtIssued } from './EditDocketEntryMetaFormCourtIssued';
import { EditDocketEntryMetaFormDocument } from './EditDocketEntryMetaFormDocument';
import { EditDocketEntryMetaFormNoDocument } from './EditDocketEntryMetaFormNoDocument';
import { EditDocketEntryMetaTabAction } from './EditDocketEntryMetaTabAction';
import { EditDocketEntryMetaTabService } from './EditDocketEntryMetaTabService';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FormCancelModalDialog } from '@web-client/views/FormCancelModalDialog';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { isLeadCase, isMemberCase } from '@shared/business/entities/cases/Case';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditDocketEntryMeta = connect(
  {
    closeModalAndReturnToCaseDetailSequence:
      sequences.closeModalAndReturnToCaseDetailSequence,
    editType: state.screenMetadata.editType,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitEditDocketEntryMetaSequence:
      sequences.submitEditDocketEntryMetaSequence,
    caseDetail: state.caseDetail,
    formattedCaseDetail: state.formattedCaseDetail,
    form: state.form,
    isFiledAcrossAllCases: state.isFiledAcrossAllCases,
  },
  function EditDocketEntryMeta({
    closeModalAndReturnToCaseDetailSequence,
    editType,
    formCancelToggleCancelSequence,
    showModal,
    submitEditDocketEntryMetaSequence,
    caseDetail,
    formattedCaseDetail,
    form,
    isFiledAcrossAllCases,
  }) {
    const isDisabled =
      caseDetail && isMemberCase(caseDetail) && isFiledAcrossAllCases;
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <div className="grid-col-5 title">
              <h1>Docket Entry</h1>
            </div>
            <div className="grid-col-7">
              <div className="display-flex flex-row flex-justify flex-align-center">
                <div className="margin-top-1 margin-bottom-1 docket-entry-preview-text edit-docket--visible-overflow">
                  <span className="text-bold">Docket Entry preview: </span>
                  <EditDocketEntryMetaDocketEntryPreview />
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5 DocumentDetail">
              {caseDetail &&
                isLeadCase(caseDetail) &&
                formattedCaseDetail?.consolidatedCases &&
                formattedCaseDetail.consolidatedCases.length > 1 && (
                  <InfoNotificationComponent
                    alertInfo={{
                      message: (
                        <div className="margin-top-2 margin-bottom-2">
                          <b>Edits to Document Info will also be edited for:</b>
                          <ul className="usa-list padding-top-0 padding-bottom-0 margin-top-1 margin-bottom-1">
                            {formattedCaseDetail.consolidatedCases
                              .filter(
                                c => c.docketNumber !== caseDetail.docketNumber,
                              )
                              .map(c => (
                                <li
                                  key={c.docketNumber}
                                  className="margin-bottom-0"
                                >
                                  {c.docketNumber}{' '}
                                  {c.caseTitle ||
                                    c.caseCaption ||
                                    form?.documentTitle ||
                                    form?.eventCode}
                                </li>
                              ))}
                          </ul>
                          <p className="margin-bottom-0 margin-top-0">
                            Service and Action edits will only apply to this
                            case.
                          </p>
                        </div>
                      ),
                    }}
                    dismissible={false}
                    scrollToTop={false}
                  />
                )}
              {isDisabled && (
                <InfoNotificationComponent
                  alertInfo={{
                    message: (
                      <div className="margin-top-1 margin-bottom-1">
                        Edits to Document Info can only be done from the{' '}
                        <strong>lead case</strong> in a consolidated group. This
                        is a member case.
                      </div>
                    ),
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />
              )}
              <Tabs
                boxed
                bind="editDocketEntryMetaTab"
                className="no-full-border-bottom tab-button-h3 container-tabs"
              >
                <Tab
                  id="tab-document-info"
                  tabName="documentInfo"
                  title="Document Info"
                >
                  {editType === 'CourtIssued' && (
                    <EditDocketEntryMetaFormCourtIssued />
                  )}
                  {editType === 'Document' && (
                    <EditDocketEntryMetaFormDocument />
                  )}
                  {editType === 'NoDocument' && (
                    <EditDocketEntryMetaFormNoDocument />
                  )}
                </Tab>
                <Tab id="tab-service" tabName="service" title="Service">
                  <EditDocketEntryMetaTabService />
                </Tab>
                <Tab
                  data-testid="tab-action"
                  id="tab-action"
                  tabName="action"
                  title="Action(s)"
                >
                  <EditDocketEntryMetaTabAction />
                </Tab>
              </Tabs>

              <div className="margin-top-3 button-container">
                <Button
                  onClick={() => {
                    submitEditDocketEntryMetaSequence();
                  }}
                  data-testid="save-edit-docket-entry-meta"
                >
                  Save
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
            <div className="grid-col-7"></div>
          </div>
        </section>
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog
            onCancelSequence={closeModalAndReturnToCaseDetailSequence}
          />
        )}
      </>
    );
  },
);

EditDocketEntryMeta.displayName = 'EditDocketEntryMeta';
