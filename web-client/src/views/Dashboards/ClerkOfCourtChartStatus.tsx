import { ClerkOfCourtDashboardStatsStatus } from '@web-client/presenter/clerkOfCourtDashboardState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

/**
 * Renders a dashboard chart once its data has loaded, and the chart's loading
 * or error state until then, centered in the space the chart will take up.
 */
export const ClerkOfCourtChartStatus = ({
  children,
  className,
  status,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  status: ClerkOfCourtDashboardStatsStatus;
  title?: string;
}) => {
  if (status === 'loaded') {
    return <>{children}</>;
  }

  const isLoading = status === 'loading';

  return (
    <div className={className} data-testid={`chart-${status}`}>
      {title && <h2 className="tw:xs:text-2xl tw:text-lg">{title}</h2>}
      <div
        aria-live="polite"
        className="tw:flex tw:flex-col tw:items-center tw:pt-8 tw:pb-12 tw:text-center tw:text-[#71767a]"
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
            : 'Something went wrong loading this chart, please refresh the page.'}
        </p>
      </div>
    </div>
  );
};
