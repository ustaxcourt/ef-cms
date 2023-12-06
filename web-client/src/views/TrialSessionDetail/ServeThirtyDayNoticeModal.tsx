import { BaseModal } from '../../ustc-ui/Modal/BaseModal';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = {
  closeModalSequence: sequences.clearModalSequence,
  dismissReminderSequence: sequences.dismissThirtyDayTrialAlertSequence,
  serveSequence: sequences.serveThirtyDayNoticeOfTrialSequence,
  serveThirtyDayNoticeModalHelper: state.serveThirtyDayNoticeModalHelper,
};

const component = ({
  closeModalSequence,
  dismissReminderSequence,
  serveSequence,
  serveThirtyDayNoticeModalHelper,
}: typeof props) => {
  return (
    <BaseModal
      preventCancelOnBlur={false}
      onBlurSequence={'clearModalSequence'}
    >
      <div className="modal-header grid-container padding-x-0">
        <div className="grid-row">
          <div className="mobile-lg:grid-col-9">
            <h3 className="modal-header__title" tabIndex={-1}>
              Serve 30 Day Notice?
            </h3>
          </div>
          <div className="mobile-lg:grid-col-3">
            <Button
              iconRight
              link
              className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
              icon="times-circle"
              onClick={() => closeModalSequence()}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
      <div className="margin-bottom-2">
        <p>
          The following document will be served on all parties:
          <span className="display-block text-bold margin-top-205">
            30 Day Notice of Trial on{' '}
            {serveThirtyDayNoticeModalHelper.formattedStartDate} at{' '}
            {serveThirtyDayNoticeModalHelper.trialLocation}
          </span>
        </p>
        <div className="margin-top-5">
          <Button id="confirm" onClick={() => serveSequence()}>
            Yes, Serve
          </Button>
          <Button secondary onClick={() => dismissReminderSequence()}>
            Dismiss Reminder
          </Button>
          <Button link onClick={() => closeModalSequence()}>
            Cancel
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export const ServeThirtyDayNoticeModal = connect(props, component);

ServeThirtyDayNoticeModal.displayName = 'ServeThirtyDayNoticeModal';
