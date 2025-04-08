import { Icon } from '../../ustc-ui/Icon/Icon';
import React from 'react';

interface PillButtonProps {
  text: string;
  'data-testid'?: string;
  buttonDataTestId?: string;
  onRemove: () => void;
}

export const PillButton = ({
  'data-testid': dataTestId,
  buttonDataTestId,
  onRemove,
  text,
}: PillButtonProps) => {
  return (
    <span className="blue-pill" data-testid={dataTestId}>
      <span>{text}</span>
      <button
        data-testid={buttonDataTestId}
        type="button"
        aria-label={`remove ${text} selection`}
        className="margin-left-1 cursor-pointer transparent-button"
        onClick={onRemove}
      >
        <Icon className="icon-class" icon="times" size="1x" />
      </button>
    </span>
  );
};
