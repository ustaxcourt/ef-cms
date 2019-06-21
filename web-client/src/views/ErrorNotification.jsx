import { Focus } from '../ustc-ui/Focus/Focus';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class ErrorNotificationComponent extends React.Component {
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
    const { alertHelper } = this.props;
    const { alertError } = this.props;

    this.notificationRef = React.createRef();

    return (
      <React.Fragment>
        {alertHelper.showErrorAlert && (
          <div
            aria-live="assertive"
            className="usa-alert usa-alert--error"
            ref={this.notificationRef}
            role="alert"
          >
            <div className="usa-alert__body">
              <Focus>
                <h3 className="usa-alert__heading">{alertError.title}</h3>
              </Focus>
              {alertHelper.showSingleMessage && (
                <p className="usa-alert__text">{alertError.message}</p>
              )}
              {alertHelper.showMultipleMessages && (
                <ul>
                  {alertError.messages.map((message, idx) => (
                    <li key={idx}>{message}</li>
                  ))}
                </ul>
              )}
              {alertHelper.showTitleOnly && (
                <div className="alert-blank-message" />
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

ErrorNotificationComponent.propTypes = {
  alertError: PropTypes.object,
  alertHelper: PropTypes.object,
};

export const ErrorNotification = connect(
  {
    alertError: state.alertError,
    alertHelper: state.alertHelper,
  },
  ErrorNotificationComponent,
);
