import { connect } from '@cerebral/react';
import React from 'react';
import seal from '../images/ustc_seal.svg';

export const Maintenance = connect(function Maintenance() {
  return (
    <>
      <section className="maintenance-page">
        <img alt="USTC Seal" src={seal} />
      </section>
    </>
  );
});
