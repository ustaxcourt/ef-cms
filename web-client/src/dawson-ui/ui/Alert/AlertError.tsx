import { Alert, AlertDescription, AlertHeader } from './Alert';
import React from 'react';

type AlertErrorProps = {
  alertError: any;
  alertHelper: any;
  closeButtonOnClick: () => void;
};

export const AlertError = ({
  alertError,
  alertHelper,
  closeButtonOnClick,
}: AlertErrorProps) => {
  console.log('alertError', alertError);
  console.log('alertHelper', alertHelper);
  if (!alertHelper.showErrorAlert) return null;

  return (
    <Alert
      isDismissible={true}
      variant="error"
      closeButtonOnClick={() => closeButtonOnClick()}
    >
      <AlertHeader>{alertError.title}</AlertHeader>
      <AlertDescription>{alertError.message}</AlertDescription>
    </Alert>
  );
};
