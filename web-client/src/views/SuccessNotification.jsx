import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

class SuccessNotificationComponent extends React.Component {
  componentDidUpdate() {
    this.focusNotification();
  }

  focusNotification() {
    const notification = this.notificationRef.current;
    if (notification) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const alertSuccess = this.props.alertSuccess;
    const dismissAlert = this.props.dismissAlert;
    this.notificationRef = React.createRef();
    const isMessageOnly =
      alertSuccess && alertSuccess.message && !alertSuccess.title;

    return (
      <React.Fragment>
        {alertSuccess && (
          <div
            aria-live="polite"
            className={classNames(
              'usa-alert',
              'usa-alert--success',
              isMessageOnly && 'usa-alert-success-message-only',
            )}
            ref={this.notificationRef}
            role="alert"
          >
            <div className="usa-alert__body">
              <div className="grid-container padding-x-0">
                <div className="grid-row">
                  <div className="tablet:grid-col-10">
                    <p className="heading-3 usa-alert__heading">
                      {alertSuccess.title}
                    </p>
                    <p className="usa-alert__text">{alertSuccess.message}</p>
                  </div>
                  <div className="tablet:grid-col-2 usa-alert__action">
                    <button
                      className="usa-button usa-button--unstyled no-underline"
                      type="button"
                      onClick={() => dismissAlert()}
                    >
                      Dismiss <FontAwesomeIcon icon="times-circle" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

SuccessNotificationComponent.propTypes = {
  alertSuccess: PropTypes.object,
  dismissAlert: PropTypes.func,
};

export const SuccessNotification = connect(
  {
    alertSuccess: state.alertSuccess,
    dismissAlert: sequences.dismissAlertSequence,
  },
  SuccessNotificationComponent,
);
