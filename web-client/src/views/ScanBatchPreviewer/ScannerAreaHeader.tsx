import { Button } from '../../ustc-ui/Button/Button';
import React from 'react';

type ScannerAreaHeaderProps = {
  onOpenChangeScannerSource: (() => void) | Function;
  scannerSource?: string;
  scannerSourceDisplayName: string;
  title: string;
};

export const ScannerAreaHeader = ({
  onOpenChangeScannerSource,
  scannerSource,
  scannerSourceDisplayName,
  title,
}: ScannerAreaHeaderProps) => {
  return (
    <div className="scanner-area-header">
      <div className="grid-container padding-x-0">
        <div className="grid-row grid-gap">
          <div className="grid-col-6">
            <h3 className="margin-bottom-0 margin-left-105">{title}</h3>
          </div>
          <div className="grid-col-6 text-right margin-top-2px padding-right-4">
            <span className="margin-right-1">Scanner: {scannerSourceDisplayName}</span>
            <Button
              link
              aria-label={`${
                scannerSource ? 'Change' : 'Select'
              } scanner source`}
              className="change-scanner-button padding-0"
              onClick={e => {
                e.preventDefault();
                onOpenChangeScannerSource();
              }}
            >
              {scannerSource ? 'Change' : 'Select Scanner'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ScannerAreaHeader.displayName = 'ScannerAreaHeader';
