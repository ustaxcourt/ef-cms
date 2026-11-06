import React from 'react';
import { RecentMessagesInboxCotCDashboard as ConnectedRecentMessagesInboxCotCDashboard } from './RecentMessagesInboxCotCDashboard';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@web-client/presenter/shared.cerebral', () => ({
  connect: (_bindings: unknown, component: unknown) => component,
}));

type TestRecentMessage = {
  caseStatus: string;
  caseTitle: string;
  consolidatedIconTooltipText?: string;
  createdAtFormatted: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  from: string;
  fromSectionFormatted: string;
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  isRead: boolean;
  message: string;
  messageDetailLink: string;
  messageId: string;
  subject: string;
};

type RecentMessagesTestProps = {
  recentMessagesHelper: { recentMessages: TestRecentMessage[] };
};

const RecentMessagesInboxCotCDashboard =
  ConnectedRecentMessagesInboxCotCDashboard as unknown as React.FC<RecentMessagesTestProps>;

const baseMessage: TestRecentMessage = {
  caseStatus: 'General Docket - Not at Issue',
  caseTitle: 'Bob Smith, Petitioner',
  createdAtFormatted: '05/01/26',
  docketNumber: '101-26',
  docketNumberWithSuffix: '101-26S',
  from: 'Test Petitionsclerk',
  fromSectionFormatted: 'Petitions',
  inConsolidatedGroup: false,
  isLeadCase: false,
  isRead: false,
  message: 'Please review',
  messageDetailLink: '/messages/101-26/message-detail/abc',
  messageId: 'abc',
  subject: 'A subject',
};

const secondMessage: TestRecentMessage = {
  ...baseMessage,
  docketNumber: '202-26',
  docketNumberWithSuffix: '202-26L',
  messageId: 'def',
};

describe('RecentMessagesInboxCotCDashboard', () => {
  const render = (recentMessages: TestRecentMessage[]): Document => {
    const markup = renderToStaticMarkup(
      <RecentMessagesInboxCotCDashboard
        recentMessagesHelper={{ recentMessages }}
      />,
    );
    return new DOMParser().parseFromString(markup, 'text/html');
  };

  it('should render each docket number with suffix as a link to the case detail page', () => {
    const doc = render([baseMessage, secondMessage]);

    const links = Array.from(
      doc.querySelectorAll(
        '[data-testid="recent-messages-docketNumber-cell"] a',
      ),
    );

    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/case-detail/101-26',
      '/case-detail/202-26',
    ]);
    expect(links.map(link => link.textContent)).toEqual(['101-26S', '202-26L']);
  });

  it('should not render any docket number links when there are no recent messages', () => {
    const doc = render([]);

    expect(doc.querySelectorAll('a[href^="/case-detail/"]').length).toEqual(0);
    expect(doc.body.textContent).toContain('There are no messages.');
  });
});
