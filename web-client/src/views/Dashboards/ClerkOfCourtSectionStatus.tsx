import { ClerkOfCourtDashboardStatsStatus } from '@web-client/presenter/clerkOfCourtDashboardState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

/**
 * Renders a dashboard section once its data has loaded. Each section (a chart
 * tab, the trial sessions or the recent messages) has its own request, so until
 * then the section shows its own loading or error state.
 */
export const ClerkOfCourtSectionStatus = ({
  children,
  label = 'chart',
  status,
}: {
  children: React.ReactNode;
  label?: string;
  status: ClerkOfCourtDashboardStatsStatus;
}): React.JSX.Element => {
  if (status === 'loaded') {
    return <>{children}</>;
  }

  const isLoading = status === 'loading';

  return (
    <div
      aria-live="polite"
      className="tw:flex tw:flex-col tw:items-center tw:pt-8 tw:pb-12 tw:text-center tw:text-[#71767a]"
      data-testid={`${label.replace(/ /g, '-')}-${status}`}
      role="status"
    >
      <FontAwesomeIcon
        className={classNames(isLoading && 'fa-spin')}
        icon={isLoading ? 'sync' : 'times'}
        size="4x"
      />
      <p className="tw:mt-8 tw:mb-0 tw:max-w-80">
        {isLoading
          ? `Loading ${label}...`
          : 'Something went wrong, please refresh the page.'}
      </p>
    </div>
  );
};
