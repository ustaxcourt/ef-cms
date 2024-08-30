import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import classNames from 'classnames';

function getUpdatedOnClick(
  onClick: (...args: any) => any | undefined,
  disableOnClick: boolean | undefined,
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (!onClick || !disableOnClick) return onClick;

  const debouncedWrapper = debounce(async (...args) => {
    const results = onClick(...args);
    if (!(results instanceof Promise))
      throw new Error('Convert onClick method to async');

    await results.finally(() => {
      setDisableButton(false);
    });
  }, 500);

  return async (...args) => {
    setDisableButton(true);
    await debouncedWrapper(...args);
  };
}

export const Button = (props: {
  [key: string]: any;
  disableOnClick?: boolean;
}) => {
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
    'usa-button',
    tooltip && 'usa-tooltip',
    !overrideMargin && `margin-${marginDirection}-205`,
    overrideMargin,
    icon && !shouldWrapText && 'no-wrap',
    secondary && 'usa-button--outline',
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
