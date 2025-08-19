import React from 'react';
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCopy,
  faGavel,
  faLock,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash';

library.add(faLock, faWrench, faCopy, faGavel);

/**
 * Dawson UI - Icon Component
 */
export const Icon = (props: FontAwesomeIconProps) => {
  console.log(props);
  const iconProps = cloneDeep(props);
  if (iconProps['aria-label']) {
    iconProps['aria-hidden'] = false;
    iconProps.title = iconProps['aria-label'];
  }

  return <FontAwesomeIcon {...iconProps} />;
};

Icon.displayName = 'Icon';
