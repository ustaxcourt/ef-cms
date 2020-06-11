import { BigHeader } from '../BigHeader';
import { connect } from '@cerebral/react';
import React from 'react';

export const TodaysOpinions = connect({}, function TodaysOpinions() {
  return (
    <>
      <BigHeader text="HEELOO THERE" />
    </>
  );
});
