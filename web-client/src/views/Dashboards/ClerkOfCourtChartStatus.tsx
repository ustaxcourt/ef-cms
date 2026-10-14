import { ClerkOfCourtDashboardStatsStatus } from '@web-client/presenter/clerkOfCourtDashboardState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

/**
 * Renders a dashboard tab's charts once their data has loaded. All the charts
 * share one request, so until then the tab shows one loading or error state,
 * centered on the page.
 */
export const ClerkOfCourtChartStatus = ({
  children,
  status,
}: {
  children: React.ReactNode;
  status: ClerkOfCourtDashboardStatsStatus;
}) => {
  if (status === 'loaded') {
    return <>{children}</>;
  }

  const isLoading = status === 'loading';

  return (
    <div
      aria-live="polite"
      className="tw:flex tw:flex-col tw:items-center tw:pt-8 tw:pb-12 tw:text-center tw:text-[#71767a]"
      data-testid={`chart-${status}`}
      role="status"
    >
      <FontAwesomeIcon
        className={classNames(isLoading && 'fa-spin')}
        icon={isLoading ? 'sync' : 'times'}
        size="4x"
      />
      <p className="tw:mt-8 tw:mb-0 tw:max-w-80">
        {isLoading
          ? 'Loading chart...'
          : 'Something went wrong, please refresh the page.'}
      </p>
    </div>
  );
};
