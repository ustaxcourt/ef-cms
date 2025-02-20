import { connect } from '@web-client/presenter/shared.cerebral';
import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';

export const TermBuilderView = connect({}, function TermBuilderView() {
  return (
    <>
      <BigHeader text="Term Builder" />
      John Is Testing
    </>
  );
});

TermBuilderView.displayName = 'TermBuilderView';
