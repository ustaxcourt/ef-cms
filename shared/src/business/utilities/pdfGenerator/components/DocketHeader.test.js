const React = require('react');
const { DocketHeader } = require('./DocketHeader.jsx');
const { render, within } = require('@testing-library/react');

describe('DocketHeader', () => {
  it('should render the case caption from props', () => {
    const mockCaseTitle = 'Test Petitioner';
    const { container } = render(<DocketHeader caseTitle={mockCaseTitle} />);
    expect(within(container).getByText(mockCaseTitle)).toBeInTheDocument();
  });

  it('should render the case caption extension from props', () => {
    const mockCaseTitle = 'Petitioner(s)';
    const { container } = render(<DocketHeader caseTitle="Petitioner(s)" />);
    expect(within(container).getByText(mockCaseTitle)).toBeInTheDocument();
  });

  it('should render the case caption postfix', () => {
    const { container } = render(<DocketHeader />);
    expect(within(container).getByText('v.')).toBeInTheDocument();
    expect(
      within(container).getByText('Commissioner of Internal Revenue'),
    ).toBeInTheDocument();
    expect(within(container).getByText('Respondent')).toBeInTheDocument();
  });

  it('should render the docket number from props', () => {
    const mockDocketNumber = '123-45S';
    const { container } = render(
      <DocketHeader docketNumberWithSuffix={mockDocketNumber} />,
    );
    expect(
      within(container).getByText(mockDocketNumber, { exact: false }),
    ).toBeInTheDocument();
  });

  it("should only render document title if it's the only prop passed in", () => {
    const mockDocumentTitle = 'Test H3';

    const { container } = render(
      <DocketHeader documentTitle={mockDocumentTitle} />,
    );
    expect(within(container).getByText(mockDocumentTitle)).toBeInTheDocument();
  });
});
