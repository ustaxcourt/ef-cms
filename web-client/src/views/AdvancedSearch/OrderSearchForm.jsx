import { OrderSearch } from './OrderSearch';
import { connect } from '@cerebral/react';
import React from 'react';

export const OrderSearchForm = connect({}, function OrderSearchForm({
  submitAdvancedSearchSequence,
}) {
  return (
    <OrderSearch submitAdvancedSearchSequence={submitAdvancedSearchSequence} />
  );
});
