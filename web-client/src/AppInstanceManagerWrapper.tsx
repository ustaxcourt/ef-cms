import { useAppContext } from '@web-client/AppContext';
import React from 'react';

export const AppInstanceManagerWrapper = ({ children }) => {
  const { renderInstanceManagement } = useAppContext();

  if (renderInstanceManagement) {
    return <>{children}</>;
  }
  return null;
};
