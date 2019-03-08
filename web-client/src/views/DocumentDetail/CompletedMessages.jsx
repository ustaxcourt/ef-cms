import { connect } from '@cerebral/react';
import React from 'react';

class CompletedMessagesComponent extends React.Component {
  render() {
    return 'There are no completed messages associated with this document.';
  }
}

CompletedMessagesComponent.propTypes = {};

export const CompletedMessages = connect(
  {},
  CompletedMessagesComponent,
);
