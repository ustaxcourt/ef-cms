import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class SuccessNotification extends React.Component {
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
    const alertSuccess = this.props.alertSuccess;
    const dismissAlert = this.props.dismissAlert;
    this.notificationRef = React.createRef();

    return (
      <React.Fragment>
        {alertSuccess && (
          <div
            className="usa-alert usa-alert-success"
            aria-live="polite"
            role="alert"
            ref={this.notificationRef}
          >
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">{alertSuccess.title}</h3>
              <p className="usa-alert-text">{alertSuccess.message}</p>
              <button
                type="button"
                className="modal-close-button text-style"
                onClick={() => dismissAlert()}
              >
                Dismiss <FontAwesomeIcon icon="times-circle" />
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

SuccessNotification.propTypes = {
  alertSuccess: PropTypes.object,
  dismissAlert: PropTypes.func,
};

export default connect(
  {
    alertSuccess: state.alertSuccess,
    dismissAlert: sequences.dismissAlertSequence,
  },
  SuccessNotification,
);
