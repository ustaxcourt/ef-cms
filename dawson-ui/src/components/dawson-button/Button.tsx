import React, { useState, type MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';
import classNames from 'classnames';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export const DEBOUNCE_TIME_MILLISECONDS = 500;

type OnClickHandler = (
  event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
) => void | Promise<void>;

function getUpdatedOnClick(
  onClick: OnClickHandler | undefined,
  disableOnClick: boolean | undefined,
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>,
): OnClickHandler | undefined {
  if (!onClick || !disableOnClick) return onClick;

  const debouncedWrapper = debounce(
    async (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      const results = onClick(event);
      if (!(results instanceof Promise))
        throw new Error('Convert onClick method to async');

      await results.finally(() => {
        setDisableButton(false);
      });
    },
    DEBOUNCE_TIME_MILLISECONDS,
  );

  return async (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setDisableButton(true);
    await debouncedWrapper(event);
  };
}

interface ButtonProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
  disableOnClick?: boolean;
  icon?: IconProp;
  iconColor?: string;
  iconRight?: boolean;
  iconSize?:
    | '1x'
    | '2x'
    | '3x'
    | '4x'
    | '5x'
    | '6x'
    | '7x'
    | '8x'
    | '9x'
    | '10x';
  isActive?: boolean;
  link?: boolean;
  marginDirection?: 'left' | 'right';
  noMargin?: boolean;
  onClick?: OnClickHandler;
  overrideMargin?: boolean;
  secondary?: boolean;
  destructive?: boolean;
  shouldWrapText?: boolean;
  tooltip?: string;
  disabled?: boolean;
  title?: string;
  'aria-pressed'?: boolean;
  [key: string]: unknown;
}

export const Button = (props: ButtonProps) => {
  const [disableButton, setDisableButton] = useState(false);

  const { href } = props;
  const {
    children,
    className,
    disableOnClick,
    icon,
    iconColor, // e.g. blue
    iconRight = false,
    iconSize = '1x',
    isActive = false,
    link,
    marginDirection = 'right',
    noMargin = false,
    onClick,
    overrideMargin = false,
    secondary,
    destructive,
    shouldWrapText = false,
    tooltip,
    ...remainingProps
  } = props;

  const isLink = Boolean(href);
  const Element = isLink ? 'a' : 'button';
  if (isActive && !isLink && remainingProps['aria-pressed'] === undefined) {
    remainingProps['aria-pressed'] = true;
  }

  const classes = classNames(
    className,
    'dawson-button',
    tooltip && 'usa-tooltip',
    !overrideMargin && `margin-${marginDirection}-205`,
    overrideMargin,
    icon && !shouldWrapText && 'no-wrap',
    secondary && 'usa-button--outline', // primary secondary destructive tertiary tertiary-destructive
    destructive && '',
    link && 'usa-button--unstyled ustc-button--unstyled',
  );

  const iconClasses = classNames(
    iconRight ? 'margin-left-05' : noMargin ? 'margin-0' : 'margin-right-05',
    iconColor && `fa-icon-${iconColor}`,
  );

  return (
    <Element
      className={classes}
      disabled={disableButton}
      {...remainingProps}
      title={tooltip}
      onClick={getUpdatedOnClick(onClick, disableOnClick, setDisableButton)}
    >
      {icon && !iconRight && (
        <FontAwesomeIcon className={iconClasses} icon={icon} size={iconSize} />
      )}
      {children}
      {icon && iconRight && (
        <FontAwesomeIcon className={iconClasses} icon={icon} size={iconSize} />
      )}
    </Element>
  );
};
