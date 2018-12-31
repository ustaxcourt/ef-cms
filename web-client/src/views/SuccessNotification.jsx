import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

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
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

SuccessNotification.propTypes = {
  alertSuccess: PropTypes.object,
};

export default connect(
  {
    alertSuccess: state.alertSuccess,
  },
  SuccessNotification,
);
