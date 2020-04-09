import { Text } from './Text';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React, { useEffect } from 'react';

export const ValidationText = connect(
  {
    setFieldOrderSequence: sequences.setFieldOrderSequence,
  },
  function ValidationText({ field, setFieldOrderSequence }) {
    useEffect(() => {
      setFieldOrderSequence({ field });
    }, []);
    return (
      <Text bind={`validationErrors.${field}`} className="usa-error-message" />
    );
  },
);
