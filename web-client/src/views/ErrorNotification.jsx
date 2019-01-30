import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class ErrorNotification extends React.Component {
  componentDidUpdate() {
    this.focusNotification();
  }

  focusNotification() {
    const notification = this.notificationRef.current;
    if (notification) {
      notification.scrollIntoView();
    }
  }

  render() {
    const alertHelper = this.props.alertHelper;
    const alertError = this.props.alertError;

    this.notificationRef = React.createRef();

    return (
      <React.Fragment>
        {alertHelper.showErrorAlert && (
          <div
            className="usa-alert usa-alert-error"
            aria-live="assertive"
            role="alert"
            ref={this.notificationRef}
          >
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">{alertError.title}</h3>
              {alertHelper.showSingleMessage && (
                <p className="usa-alert-text">{alertError.message}</p>
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

ErrorNotification.propTypes = {
  alertHelper: PropTypes.object,
  alertError: PropTypes.object,
};

export default connect(
  {
    alertHelper: state.alertHelper,
    alertError: state.alertError,
  },
  ErrorNotification,
);
