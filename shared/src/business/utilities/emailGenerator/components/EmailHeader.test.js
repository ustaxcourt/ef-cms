const React = require('react');
const { EmailHeader } = require('./EmailHeader.jsx');
const { render } = require('@testing-library/react');

describe('EmailHeader', () => {
  it('renders a header with US Tax Court info', () => {
    const { getByTestId } = render(<EmailHeader />);

    expect(getByTestId('header').textContent).toBe('United States Tax Court');
    expect(getByTestId('location').textContent).toBe('Washington, DC 20217');
  });

  it('renders the date from props if present', () => {
    const { getByTestId } = render(<EmailHeader date={'May 14, 2020'} />);

    expect(getByTestId('date').textContent).toBe('May 14, 2020');
  });
});
