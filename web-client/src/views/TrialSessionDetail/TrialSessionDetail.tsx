import { AllCases } from './AllCases';
import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { DeleteTrialSessionModal } from '@web-client/views/TrialSessionDetail/DeleteTrialSessionModal';
import { DismissThirtyDayNoticeModal } from './DismissThirtyDayNoticeModal';
import { EligibleCases } from './EligibleCases';
import { ErrorNotification } from '../ErrorNotification';
import { InactiveCases } from './InactiveCases';
import { NoticeStatusModal } from '../NoticeStatusModal';
import { OpenCases } from './OpenCases';
import { PaperServiceStatusModal } from '../PaperServiceStatusModal';
import { ReprintPaperServiceDocumentsModal } from '@web-client/views/TrialSessions/ReprintPaperServiceDocumentsModal';
import { ServeThirtyDayNoticeModal } from './ServeThirtyDayNoticeModal';
import { SetCalendarModalDialog } from './SetCalendarModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionDetailHeader } from './TrialSessionDetailHeader';
import { TrialSessionInformation } from './TrialSessionInformation';
import {
  WarningNotification,
  WarningNotificationComponent,
} from '../WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionDetail = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openConfirmModalSequence: sequences.openConfirmModalSequence,
    openSetCalendarModalSequence: sequences.openSetCalendarModalSequence,
    showModal: state.modal.showModal,
    showThirtyDayNoticeModalSequence:
      sequences.showThirtyDayNoticeModalSequence,
    trialSessionDetailsHelper: state.trialSessionDetailsHelper,
  },
  function TrialSessionDetail({
    formattedTrialSessionDetails,
    openConfirmModalSequence,
    openSetCalendarModalSequence,
    showModal,
    showThirtyDayNoticeModalSequence,
    trialSessionDetailsHelper,
  }) {
    return (
      <>
        <TrialSessionDetailHeader />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <WarningNotification />

          {formattedTrialSessionDetails.showAlertForNOTTReminder && (
            <WarningNotificationComponent
              alertWarning={{
                dismissIcon: 'paper-plane',
                dismissText: trialSessionDetailsHelper.nottReminderAction,
                message: formattedTrialSessionDetails.alertMessageForNOTT,
              }}
              dismissAlertSequence={showThirtyDayNoticeModalSequence}
              dismissible={trialSessionDetailsHelper.canDismissThirtyDayAlert}
              iconRight={false}
              messageNotBold={true}
              scrollToTop={false}
            />
          )}

          <TrialSessionInformation />

          {!formattedTrialSessionDetails.isCalendared && (
            <Tabs
              bind="trialSessionDetailsTab.caseList"
              defaultActiveTab="EligibleCases"
            >
              {trialSessionDetailsHelper.showSetCalendarButton && (
                <Button
                  className="tab-right-button ustc-ui-tabs ustc-ui-tabs--right-button-container"
                  icon="calendar-check"
                  id="set-calendar-button"
                  onClick={() => openSetCalendarModalSequence()}
                >
                  Set Calendar
                </Button>
              )}
              <Tab
                id="eligible-cases-tab"
                tabName="EligibleCases"
                title="Eligible Cases"
              >
                {formattedTrialSessionDetails.isHybridSession && (
                  <div className="grid-container padding-0">
                    <div
                      className={`grid-row hide-on-mobile ${
                        trialSessionDetailsHelper.showQcComplete
                          ? 'margin-bottom-neg-205'
                          : 'margin-bottom-2'
                      }
                        `}
                    >
                      <label
                        className="dropdown-label-serif margin-right-3 padding-top-05"
                        htmlFor="hybrid-session-filter"
                        id="hybrid-session-filter-label"
                      >
                        Filter by
                      </label>
                      <BindedSelect
                        aria-describedby="hybrid-session-filter-label"
                        aria-label="hybrid session filter"
                        bind="screenMetadata.eligibleCasesFilter.hybridSessionFilter"
                        className="select-left maxw-card-lg"
                        disabled={
                          formattedTrialSessionDetails.disableHybridFilter
                        }
                        id="hybrid-session-filter"
                        name="hybridSessionFilter"
                      >
                        <option value="">-Case Procedure-</option>
                        <option value="Regular">Regular</option>
                        <option value="Small">Small</option>
                      </BindedSelect>
                    </div>
                  </div>
                )}
                <div id="eligible-cases-tab-content">
                  <EligibleCases />
                </div>
              </Tab>
            </Tabs>
          )}

          {formattedTrialSessionDetails.showOpenCases && (
            <div>
              <Tabs
                bind="trialSessionDetailsTab.calendaredCaseList"
                defaultActiveTab="OpenCases"
              >
                {formattedTrialSessionDetails.canClose && (
                  <Button
                    link
                    className="ustc-ui-tabs ustc-ui-tabs--right-link-button margin-right-0 red-warning ustc-button--mobile-inline"
                    id="close-session-button"
                    onClick={() => openConfirmModalSequence()}
                  >
                    Close Session
                  </Button>
                )}
                <Tab id="open-cases-tab" tabName="OpenCases" title="Open Cases">
                  <div id="open-cases-tab-content">
                    <OpenCases />
                  </div>
                </Tab>
                <Tab
                  id="inactive-cases-tab"
                  tabName="InactiveCases"
                  title="Inactive Cases"
                >
                  <div id="inactive-cases-tab-content">
                    <InactiveCases />
                  </div>
                </Tab>
                <Tab id="all-cases-tab" tabName="AllCases" title="All Cases">
                  <div id="all-cases-tab-content">
                    <AllCases />
                  </div>
                </Tab>
              </Tabs>
            </div>
          )}

          {formattedTrialSessionDetails.showOnlyClosedCases && (
            <Tabs
              bind="trialSessionDetailsTab.calendaredCaseList"
              defaultActiveTab="InactiveCases"
            >
              {formattedTrialSessionDetails.canClose && (
                <Button
                  link
                  className="ustc-ui-tabs ustc-ui-tabs--right-link-button margin-right-0 red-warning"
                  id="close-session-button"
                  onClick={() => openConfirmModalSequence()}
                >
                  Close Session
                </Button>
              )}
              <Tab
                id="inactive-cases-tab"
                tabName="InactiveCases"
                title="Cases"
              >
                <div id="inactive-cases-tab-content">
                  <InactiveCases />
                </div>
              </Tab>
            </Tabs>
          )}
        </section>

        {showModal == 'SetCalendarModalDialog' && <SetCalendarModalDialog />}
        {showModal == 'ConfirmModalDialog' && (
          <ConfirmModal
            cancelLabel="No, Cancel"
            confirmLabel="Yes, Close Session"
            title="Are you sure you want to close this session?"
            onCancelSequence="clearModalSequence"
            onConfirmSequence="closeTrialSessionSequence"
          >
            {' '}
            You will not be able to reopen this session.
          </ConfirmModal>
        )}
        {showModal === 'ServeThirtyDayNoticeModal' && (
          <ServeThirtyDayNoticeModal />
        )}
        {showModal === 'DismissThirtyDayNoticeModal' && (
          <DismissThirtyDayNoticeModal />
        )}
        {showModal === 'NoticeStatusModal' && <NoticeStatusModal />}
        {showModal === 'PaperServiceStatusModal' && <PaperServiceStatusModal />}
        {showModal === 'ReprintPaperServiceDocumentsModal' && (
          <ReprintPaperServiceDocumentsModal />
        )}
        {showModal === 'DeleteTrialSessionModal' && <DeleteTrialSessionModal />}
      </>
    );
  },
);

TrialSessionDetail.displayName = 'TrialSessionDetail';
