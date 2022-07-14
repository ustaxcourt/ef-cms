const React = require('react');
const { EmailHeader } = require('./EmailHeader.jsx');
const { render } = require('@testing-library/react');

describe('EmailHeader', () => {
  it('renders a header with US Tax Court info', () => {
    const { queryByText } = render(<EmailHeader />);

    expect(queryByText('United States Tax Court')).toBeInTheDocument();
    expect(queryByText('Washington, DC 20217')).toBeInTheDocument();
  });

  it('renders the date from props if present', () => {
    const { queryByText } = render(<EmailHeader date={'May 14, 2020'} />);

    expect(queryByText('May 14, 2020')).toBeInTheDocument();
  });
});
