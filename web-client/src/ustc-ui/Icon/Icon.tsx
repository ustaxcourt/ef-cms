import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { cloneDeep } from 'lodash';
import React from 'react';
/**
 * Icon component
 * Useful for copying an aria-label on an icon to a tool-tip 'title' attribute,
 * particularly when an icon is used without any accompanying on-screen text
 * explanation
 *
 * @param {object} props the properties to be passed to the FontAwesomeIcon
 * @returns {object} a react component
 */
export const Icon = props => {
  const iconProps = cloneDeep(props);
  if (iconProps['aria-label']) {
    iconProps['aria-hidden'] = false;
    return (
      <span title={iconProps['aria-label']}>
        <FontAwesomeIcon {...iconProps} />
      </span>
    );
  }

  return <FontAwesomeIcon {...iconProps} />;
};

Icon.displayName = 'Icon';

type IconWithTooltipProps = {
  spanClass?: string;
  iconClass?: string;
  onClick?: React.MouseEventHandler<SVGElement | HTMLSpanElement>;
  spanAriaLabel?: string;
  iconAriaLabel?: string;
  title?: string;
  color?: string;
  icon: IconProp;
  size?: FontAwesomeIconProps['size'];
  spanDataTestId?: string;
  ariaHidden?: boolean | undefined;
};

export const WrappedIcon: React.FC<IconWithTooltipProps> = ({
  iconAriaLabel,
  spanAriaLabel,
  icon,
  size,
  title,
  iconClass,
  spanClass,
  color,
  onClick,
  spanDataTestId,
  ariaHidden,
}) => {
  return (
    <span
      data-testid={spanDataTestId}
      aria-label={spanAriaLabel}
      className={spanClass}
      title={title}
    >
      <FontAwesomeIcon
        aria-hidden={ariaHidden}
        aria-label={iconAriaLabel}
        color={color}
        onClick={onClick}
        icon={icon}
        size={size}
        className={iconClass}
      />
    </span>
  );
};
