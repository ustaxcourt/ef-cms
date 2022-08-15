const React = require('react');
const { AddressLabel } = require('./AddressLabel.jsx');
const { render, within } = require('@testing-library/react');

describe('AddressLabel', () => {
  let mockData = {
    additionalName: 'Some Additional Person',
    address1: '123 Some Street',
    address2: 'Address 2',
    address3: 'Address 3',
    city: 'Some City',
    countryName: 'USA',
    inCareOf: 'Someone cool',
    name: 'Test Person',
    postalCode: '89890',
    secondaryName: 'Mr. Rogers',
    state: 'ZZ',
    title: 'Mister',
  };

  it('should render the name and address', () => {
    const { container } = render(
      <AddressLabel
        address1={mockData.address1}
        city={mockData.city}
        countryName={mockData.countryName}
        name={mockData.name}
        postalCode={mockData.postalCode}
        state={mockData.state}
      />,
    );
    expect(within(container).getByText(mockData.address1)).toBeInTheDocument();
    expect(
      within(container).getByText(mockData.city, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(container).getByText(mockData.countryName),
    ).toBeInTheDocument();
    expect(within(container).getByText(mockData.name)).toBeInTheDocument();
    expect(
      within(container).getByText(mockData.postalCode, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(container).getByText(mockData.state, { exact: false }),
    ).toBeInTheDocument();
  });

  it('should render optional address information if present', () => {
    const { container } = render(
      <AddressLabel
        additionalName={mockData.additionalName}
        address1={mockData.address1}
        address2={mockData.address2}
        address3={mockData.address3}
        city={mockData.city}
        inCareOf={mockData.inCareOf}
        name={mockData.name}
        postalCode={mockData.postalCode}
        secondaryName={mockData.secondaryName}
        state={mockData.state}
        title={mockData.title}
      />,
    );

    expect(
      within(container).queryByText(mockData.countryName),
    ).not.toBeInTheDocument();
    expect(
      within(container).getByText(mockData.additionalName, { exact: false }),
    ).toBeInTheDocument();
    expect(within(container).getByText(mockData.address2)).toBeInTheDocument();
    expect(within(container).getByText(mockData.address3)).toBeInTheDocument();
    expect(
      within(container).getByText(mockData.inCareOf, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(container).getByText(mockData.secondaryName, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(container).queryAllByText(mockData.title, { exact: false }).length,
    ).toBe(2);
  });
});
