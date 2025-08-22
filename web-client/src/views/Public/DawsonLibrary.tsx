import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';
import '../../dawson-ui/styles/main.css';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <h2 className="text-3xl">Button</h2>
        <button className="bg-blue-500">Test</button>
      </div>
    </>
  );
};
