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
    const alertError = this.props.alertError;
    this.notificationRef = React.createRef();

    return (
      <React.Fragment>
        {alertError && (
          <div
            className="usa-alert usa-alert-error"
            aria-live="assertive"
            role="alert"
            ref={this.notificationRef}
          >
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">{alertError.title}</h3>
              <p className="usa-alert-text">{alertError.message}</p>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

ErrorNotification.propTypes = {
  alertError: PropTypes.object,
};

export default connect(
  {
    alertError: state.alertError,
  },
  ErrorNotification,
);
