import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <h2 className="tw:text-3xl">Button</h2>
        <button className="tw:bg-accent tw:text-primary">
          Test Button with Tailwind
        </button>
      </div>
    </>
  );
};
