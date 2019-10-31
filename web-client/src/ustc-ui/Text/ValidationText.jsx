import { Text } from './Text';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class ValidationTextComponent extends React.Component {
  componentDidMount() {
    this.props.setFieldOrderSequence({ field: this.props.field });
  }

  render() {
    return (
      <Text
        bind={`validationErrors.${this.props.field}`}
        className="usa-error-message"
      />
    );
  }
}

ValidationTextComponent.propTypes = {
  field: PropTypes.string,
  setFieldOrderSequence: PropTypes.func,
};

export const ValidationText = connect(
  {
    setFieldOrderSequence: sequences.setFieldOrderSequence,
  },
  ValidationTextComponent,
);
