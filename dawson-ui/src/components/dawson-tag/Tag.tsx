import type { ReactNode } from 'react';
import '../../../../web-client/src/index.scss';
import '../../index.scss';
import { Icon } from '../Icon';
import classNames from 'classnames';

type IconTypes = 'none' | 'wrench';
type ThemeTypes = 'primary' | 'danger';

export const Tag = ({
  children,
  icon,
  theme,
}: {
  children: ReactNode;
  icon: IconTypes;
  theme: ThemeTypes;
}) => {
  return (
    <span
      className={classNames({
        dawson_tag: true,
        danger_tag: theme == 'danger',
      })}
    >
      {icon != 'none' && (
        <Icon className="text-center margin-right-1" icon={icon} size="1x" />
      )}
      {children}
    </span>
  );
};
