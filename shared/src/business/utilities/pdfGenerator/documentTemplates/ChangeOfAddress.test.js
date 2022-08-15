const React = require('react');
const { ChangeOfAddress } = require('./ChangeOfAddress.jsx');
const { COUNTRY_TYPES } = require('../../../entities/EntityConstants.js');
const { queryByAttribute, render, within } = require('@testing-library/react');

describe('ChangeOfAddress', () => {
  let options;
  let newData;
  let oldData;
  const getById = queryByAttribute.bind(null, 'id');

  beforeAll(() => {
    newData = {
      address1: 'New Address 1',
      address2: 'New Address 2',
      address3: 'New Address 3',
      city: 'New City',
      country: 'USA',
      email: 'new@example.com',
      inCareOf: 'New Care Of',
      phone: '321-321-4321',
      postalCode: '54321',
      state: 'NS',
    };

    oldData = {
      address1: 'Address 1',
      address2: 'Address 2',
      address3: 'Address 3',
      city: 'City',
      country: 'USA',
      email: 'old@example.com',
      inCareOf: 'Test Care Of',
      phone: '123-124-1234',
      postalCode: '12345',
      state: 'AL',
    };

    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
      isAddressAndPhoneChange: false,
      isAddressChange: false,
      isEmailChange: false,
      isPhoneChangeOnly: false,
    };
  });

  it('should render a table with the old contact information', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, countryType: undefined }}
        oldData={{ ...oldData, countryType: undefined }}
        options={{
          ...options,
          isAddressAndPhoneChange: true,
          isAddressChange: true,
        }}
      />,
    );

    const table = getById(container, 'contact_info_Old');

    expect(
      within(table).getByText('Old Contact Information'),
    ).toBeInTheDocument();
    expect(
      within(table).getByText(`c/o ${oldData.inCareOf}`),
    ).toBeInTheDocument();
    expect(within(table).getByText(oldData.address1)).toBeInTheDocument();
    expect(within(table).getByText(oldData.address2)).toBeInTheDocument();
    expect(within(table).getByText(oldData.address3)).toBeInTheDocument();
    expect(
      within(table).getByText(oldData.city, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(table).getByText(oldData.state, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(table).getByText(oldData.postalCode, { exact: false }),
    ).toBeInTheDocument();
    expect(within(table).getByText(oldData.country)).toBeInTheDocument();
    expect(within(table).getByText(oldData.phone)).toBeInTheDocument();
  });

  it('should render a table with the new contact address and phone information', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, countryType: undefined }}
        oldData={{ ...oldData, countryType: undefined }}
        options={{
          ...options,
          isAddressAndPhoneChange: true,
          isAddressChange: true,
        }}
      />,
    );
    const table = getById(container, 'contact_info_New');

    expect(
      within(table).getByText('New Contact Information'),
    ).toBeInTheDocument();
    expect(
      within(table).getByText(`c/o ${newData.inCareOf}`),
    ).toBeInTheDocument();
    expect(within(table).getByText(newData.address1)).toBeInTheDocument();
    expect(within(table).getByText(newData.address2)).toBeInTheDocument();
    expect(within(table).getByText(newData.address3)).toBeInTheDocument();
    expect(
      within(table).getByText(newData.city, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(table).getByText(newData.state, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(table).getByText(newData.postalCode, { exact: false }),
    ).toBeInTheDocument();
    expect(within(table).getByText(newData.country)).toBeInTheDocument();
    expect(within(table).getByText(newData.phone)).toBeInTheDocument();
  });

  it('should only display an email address change if options.isEmailChange is true', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={{
          ...options,
          isAddressAndPhoneChange: false,
          isAddressChange: false,
          isEmailChange: true,
          isPhoneChangeOnly: false,
        }}
      />,
    );
    const oldTable = getById(container, 'contact_info_Old');

    expect(
      within(oldTable).getByText('Old Contact Information'),
    ).toBeInTheDocument();

    expect(within(oldTable).getByText(oldData.email)).toBeInTheDocument();
    expect(within(oldTable).queryByText(oldData.phone)).not.toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.address1),
    ).not.toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(
      within(newTable).getByText('New Contact Information'),
    ).toBeInTheDocument();
    expect(within(newTable).getByText(newData.email)).toBeInTheDocument();
    expect(within(oldTable).queryByText(oldData.phone)).not.toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.address1),
    ).not.toBeInTheDocument();
  });

  it('should only display a phone number change if options.isPhoneChangeOnly is true', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={{ ...options, isPhoneChangeOnly: true }}
      />,
    );
    const oldTable = getById(container, 'contact_info_Old');

    expect(within(oldTable).getByText(oldData.phone)).toBeInTheDocument();
    expect(
      within(oldTable).getByText('Old Contact Information'),
    ).toBeInTheDocument();

    expect(
      within(oldTable).queryByText(oldData.address1),
    ).not.toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.inCareOf),
    ).not.toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.address2),
    ).not.toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.address3),
    ).not.toBeInTheDocument();
    expect(within(oldTable).queryByText(oldData.city)).not.toBeInTheDocument();
    expect(within(oldTable).queryByText(oldData.state)).not.toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.postalCode),
    ).not.toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.country),
    ).not.toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(
      within(newTable).getByText('New Contact Information'),
    ).toBeInTheDocument();
    expect(within(newTable).getByText(newData.phone)).toBeInTheDocument();

    expect(
      within(newTable).queryByText(newData.address1),
    ).not.toBeInTheDocument();
    expect(
      within(newTable).queryByText(newData.inCareOf),
    ).not.toBeInTheDocument();
    expect(
      within(newTable).queryByText(newData.address2),
    ).not.toBeInTheDocument();
    expect(
      within(newTable).queryByText(newData.address3),
    ).not.toBeInTheDocument();
    expect(within(newTable).queryByText(newData.city)).not.toBeInTheDocument();
    expect(within(newTable).queryByText(newData.state)).not.toBeInTheDocument();
    expect(
      within(newTable).queryByText(newData.postalCode),
    ).not.toBeInTheDocument();
    expect(
      within(newTable).queryByText(newData.country),
    ).not.toBeInTheDocument();
  });

  it('should only display an address change if options.showOnlyPhoneChange  and options.showAddressAndPhoneChange are falsy', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={{
          ...options,
          isAddressChange: true,
        }}
      />,
    );
    const oldTable = getById(container, 'contact_info_Old');
    expect(
      within(oldTable).getByText('Old Contact Information'),
    ).toBeInTheDocument();
    expect(
      within(oldTable).getByText(`c/o ${oldData.inCareOf}`),
    ).toBeInTheDocument();
    expect(within(oldTable).getByText(oldData.address1)).toBeInTheDocument();
    expect(within(oldTable).getByText(oldData.address2)).toBeInTheDocument();
    expect(within(oldTable).getByText(oldData.address3)).toBeInTheDocument();
    expect(
      within(oldTable).getByText(oldData.city, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(oldTable).getByText(oldData.state, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(oldTable).getByText(oldData.postalCode, { exact: false }),
    ).toBeInTheDocument();
    expect(within(oldTable).getByText(oldData.country)).toBeInTheDocument();
    expect(within(oldTable).queryByText(oldData.phone)).not.toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(
      within(newTable).getByText('New Contact Information'),
    ).toBeInTheDocument();

    expect(
      within(newTable).getByText(`c/o ${newData.inCareOf}`),
    ).toBeInTheDocument();
    expect(within(newTable).getByText(newData.address1)).toBeInTheDocument();
    expect(within(newTable).getByText(newData.address2)).toBeInTheDocument();
    expect(within(newTable).getByText(newData.address3)).toBeInTheDocument();
    expect(
      within(newTable).getByText(newData.city, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(newTable).getByText(newData.state, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(newTable).getByText(newData.postalCode, { exact: false }),
    ).toBeInTheDocument();
    expect(within(newTable).getByText(newData.country)).toBeInTheDocument();
    expect(within(newTable).queryByText(newData.phone)).not.toBeInTheDocument();
  });

  it('should not show inCareOf if not provided in the old or new data', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, inCareOf: undefined }}
        oldData={{ ...oldData, inCareOf: undefined }}
        options={options}
      />,
    );
    const oldTable = getById(container, 'contact_info_Old');
    expect(
      within(oldTable).queryByText(`c/o ${oldData.inCareOf}`),
    ).not.toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(
      within(newTable).queryByText(`c/o ${newData.inCareOf}`),
    ).not.toBeInTheDocument();
  });

  it('should not show city if not provided in the old or new data', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, city: undefined }}
        oldData={{ ...oldData, city: undefined }}
        options={options}
      />,
    );

    const oldTable = getById(container, 'contact_info_Old');
    expect(within(oldTable).queryByText(oldData.city)).not.toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(within(newTable).queryByText(newData.city)).not.toBeInTheDocument();
  });

  it('should not show country if not provided in the old or new data', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, country: undefined }}
        oldData={{ ...oldData, country: undefined }}
        options={options}
      />,
    );
    const oldTable = getById(container, 'contact_info_Old');
    expect(
      within(oldTable).queryByText(oldData.country),
    ).not.toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(
      within(newTable).queryByText(newData.country),
    ).not.toBeInTheDocument();
  });

  it('should not show country if countryType is domestic', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, countryType: COUNTRY_TYPES.DOMESTIC }}
        oldData={{ ...oldData, countryType: COUNTRY_TYPES.DOMESTIC }}
        options={{ ...options, isAddressChange: true }}
      />,
    );

    const oldTable = getById(container, 'contact_info_Old');
    expect(within(oldTable).getByText(oldData.address1)).toBeInTheDocument();
    expect(
      within(oldTable).queryByText(oldData.country),
    ).not.toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(within(newTable).getByText(newData.address1)).toBeInTheDocument();
    expect(
      within(newTable).queryByText(newData.country),
    ).not.toBeInTheDocument();
  });

  it('should show country if countryType is international', () => {
    const { container } = render(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, countryType: COUNTRY_TYPES.INTERNATIONAL }}
        oldData={{ ...oldData, countryType: COUNTRY_TYPES.INTERNATIONAL }}
        options={{ ...options, isAddressChange: true }}
      />,
    );
    const oldTable = getById(container, 'contact_info_Old');
    expect(within(oldTable).getByText(oldData.country)).toBeInTheDocument();

    const newTable = getById(container, 'contact_info_New');
    expect(within(newTable).getByText(newData.country)).toBeInTheDocument();
  });
});
