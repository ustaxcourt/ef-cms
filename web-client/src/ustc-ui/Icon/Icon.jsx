import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  let iconProps = cloneDeep(props);
  if (iconProps['aria-label']) {
    iconProps['aria-hidden'] = false;
    iconProps.title = iconProps['aria-label'];
  }

  return <FontAwesomeIcon {...iconProps} />;
};

Icon.displayName = 'Icon';
