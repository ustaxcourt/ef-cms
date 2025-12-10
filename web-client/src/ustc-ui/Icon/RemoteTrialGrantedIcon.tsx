import { Icon } from './Icon';
import React from 'react';
import classNames from 'classnames';

export const RemoteTrialGrantedIcon = ({
  remoteTrialGranted = false,
}: {
  remoteTrialGranted: boolean;
}) => {
  return (
    <>
        <span className={classNames('tw:mr-[12px]',remoteTrialGranted ? 'visibility-visible' : 'visibility-hidden')} title="Motion to Proceed Remotely Granted">
          <Icon
            aria-label="Motion to Proceed Remotely Granted"
            className="tw:text-primary"
            icon="laptop"
            data-testid="laptop"
          />
        </span>
    </>
  );
};

RemoteTrialGrantedIcon.displayName = 'RemoteTrialGrantedIcon';
