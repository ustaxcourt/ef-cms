import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faLock, faWrench } from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash';

library.add(faLock, faWrench, faCopy);

/**
 * Dawson UI - Icon Component
 */
export const Icon = props => {
  const iconProps = cloneDeep(props);
  if (iconProps['aria-label']) {
    iconProps['aria-hidden'] = false;
    iconProps.title = iconProps['aria-label'];
  }

  return <FontAwesomeIcon {...iconProps} />;
};

Icon.displayName = 'Icon';
