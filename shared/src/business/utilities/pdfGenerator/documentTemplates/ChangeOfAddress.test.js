const React = require('react');
const { ChangeOfAddress } = require('./ChangeOfAddress.jsx');
const { COUNTRY_TYPES } = require('../../../entities/EntityConstants.js');
const { shallow } = require('enzyme');

describe('ChangeOfAddress', () => {
  let options;
  let newData;
  let oldData;

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

  it('renders a table with the old contact information', () => {
    const wrapper = shallow(
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
    const table = wrapper.find('#contact_info_Old');
    const tableRowText = table.find('tbody tr').text();

    expect(table.find('thead tr th').text()).toEqual('Old Contact Information');
    expect(tableRowText).toContain(`c/o ${oldData.inCareOf}`);
    expect(tableRowText).toContain(oldData.address1);
    expect(tableRowText).toContain(oldData.address2);
    expect(tableRowText).toContain(oldData.address3);
    expect(tableRowText).toContain(oldData.city);
    expect(tableRowText).toContain(oldData.state);
    expect(tableRowText).toContain(oldData.postalCode);
    expect(tableRowText).toContain(oldData.country);
    expect(tableRowText).toContain(oldData.phone);
  });

  it('renders a table with the new contact address and phone information', () => {
    const wrapper = shallow(
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
    const table = wrapper.find('#contact_info_New');
    const tableRowText = table.find('tbody tr').text();

    expect(table.find('thead tr th').text()).toEqual('New Contact Information');
    expect(tableRowText).toContain(`c/o ${newData.inCareOf}`);
    expect(tableRowText).toContain(newData.address1);
    expect(tableRowText).toContain(newData.address2);
    expect(tableRowText).toContain(newData.address3);
    expect(tableRowText).toContain(newData.city);
    expect(tableRowText).toContain(newData.state);
    expect(tableRowText).toContain(newData.postalCode);
    expect(tableRowText).toContain(newData.country);
    expect(tableRowText).toContain(newData.phone);
  });

  it('only displays an email address change if options.isEmailChange is true', () => {
    const wrapper = shallow(
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
    const oldTable = wrapper.find('#contact_info_Old');
    const oldTableRowText = wrapper
      .find('#contact_info_Old')
      .find('tbody tr')
      .text();

    expect(oldTable.find('thead tr th').text()).toEqual(
      'Old Contact Information',
    );

    expect(oldTableRowText).toContain(oldData.email);
    // TODO expect old table text not to contain phone, address

    const newTable = wrapper.find('#contact_info_New');
    const newTableRowText = newTable.find('tbody tr').text();
    expect(newTable.find('thead tr th').text()).toEqual(
      'New Contact Information',
    );

    expect(newTableRowText).toContain(newData.email);
    // TOOD expect new table text not to contain phone, address
  });

  it('only displays a phone number change if options.isPhoneChangeOnly is true', () => {
    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={{ ...options, isPhoneChangeOnly: true }}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    const oldTableRowText = oldTable.find('tbody tr').text();

    expect(oldTable.find('thead tr th').text()).toEqual(
      'Old Contact Information',
    );

    expect(oldTableRowText).toContain(oldData.phone);
    expect(oldTableRowText).not.toContain(`c/o ${oldData.inCareOf}`);
    expect(oldTableRowText).not.toContain(oldData.address1);
    expect(oldTableRowText).not.toContain(oldData.address2);
    expect(oldTableRowText).not.toContain(oldData.address3);
    expect(oldTableRowText).not.toContain(oldData.city);
    expect(oldTableRowText).not.toContain(oldData.state);
    expect(oldTableRowText).not.toContain(oldData.postalCode);
    expect(oldTableRowText).not.toContain(oldData.country);

    const newTable = wrapper.find('#contact_info_New');
    const newTableRowText = newTable.find('tbody tr').text();

    expect(newTable.find('thead tr th').text()).toEqual(
      'New Contact Information',
    );

    expect(newTableRowText).toContain(newData.phone);

    expect(newTableRowText).not.toContain(`c/o ${newData.inCareOf}`);
    expect(newTableRowText).not.toContain(newData.address1);
    expect(newTableRowText).not.toContain(newData.address2);
    expect(newTableRowText).not.toContain(newData.address3);
    expect(newTableRowText).not.toContain(newData.city);
    expect(newTableRowText).not.toContain(newData.state);
    expect(newTableRowText).not.toContain(newData.postalCode);
    expect(newTableRowText).not.toContain(newData.country);
  });

  it('only displays an address change if options.showOnlyPhoneChange  and options.showAddressAndPhoneChange are falsy', () => {
    const wrapper = shallow(
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
    const oldTable = wrapper.find('#contact_info_Old');
    const oldTableRowText = oldTable.find('tbody tr').text();

    expect(oldTable.find('thead tr th').text()).toEqual(
      'Old Contact Information',
    );

    expect(oldTableRowText).toContain(`c/o ${oldData.inCareOf}`);
    expect(oldTableRowText).toContain(oldData.address1);
    expect(oldTableRowText).toContain(oldData.address2);
    expect(oldTableRowText).toContain(oldData.address3);
    expect(oldTableRowText).toContain(oldData.city);
    expect(oldTableRowText).toContain(oldData.state);
    expect(oldTableRowText).toContain(oldData.postalCode);
    expect(oldTableRowText).toContain(oldData.country);

    expect(oldTableRowText).not.toContain(oldData.phone);

    const newTable = wrapper.find('#contact_info_New');
    const newTableRowText = newTable.find('tbody tr').text();
    expect(newTable.find('thead tr th').text()).toEqual(
      'New Contact Information',
    );

    expect(newTableRowText).toContain(`c/o ${newData.inCareOf}`);
    expect(newTableRowText).toContain(newData.address1);
    expect(newTableRowText).toContain(newData.address2);
    expect(newTableRowText).toContain(newData.address3);
    expect(newTableRowText).toContain(newData.city);
    expect(newTableRowText).toContain(newData.state);
    expect(newTableRowText).toContain(newData.postalCode);
    expect(newTableRowText).toContain(newData.country);

    expect(newTableRowText).not.toContain(newData.phone);
  });

  it('does not show inCareOf if not provided in the old or new data', () => {
    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, inCareOf: undefined }}
        oldData={{ ...oldData, inCareOf: undefined }}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    const oldTableRowText = oldTable.find('tbody tr').text();

    expect(oldTableRowText).not.toContain(`c/o ${oldData.inCareOf}`);

    const newTableRowText = wrapper
      .find('#contact_info_New')
      .find('tbody tr')
      .text();
    expect(newTableRowText).not.toContain(`c/o ${newData.inCareOf}`);
  });

  it('does not show city if not provided in the old or new data', () => {
    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, city: undefined }}
        oldData={{ ...oldData, city: undefined }}
        options={options}
      />,
    );
    const oldTableRowText = wrapper
      .find('#contact_info_Old')
      .find('tbody tr')
      .text();

    expect(oldTableRowText).not.toContain(oldData.city);

    const newTableRowText = wrapper
      .find('#contact_info_New')
      .find('tbody tr')
      .text();
    expect(newTableRowText).not.toContain(newData.city);
  });

  it('does not show country if not provided in the old or new data', () => {
    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, country: undefined }}
        oldData={{ ...oldData, country: undefined }}
        options={options}
      />,
    );
    const oldTableRowText = wrapper
      .find('#contact_info_Old')
      .find('tbody tr')
      .text();

    expect(oldTableRowText).not.toContain(oldData.country);

    const newTable = wrapper.find('#contact_info_New');
    const newTableRowText = newTable.find('tbody tr').text();
    expect(newTableRowText).not.toContain(newData.country);
  });

  it('does not show country if countryType is domestic', () => {
    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, countryType: COUNTRY_TYPES.DOMESTIC }}
        oldData={{ ...oldData, countryType: COUNTRY_TYPES.DOMESTIC }}
        options={{ ...options, isAddressChange: true }}
      />,
    );
    const oldTableRowText = wrapper
      .find('#contact_info_Old')
      .find('tbody tr')
      .text();

    expect(oldTableRowText).toContain(oldData.address1);
    expect(oldTableRowText).not.toContain(oldData.country);

    const newTable = wrapper.find('#contact_info_New');
    const newTableRowText = newTable.find('tbody tr').text();

    expect(newTableRowText).toContain(newData.address1);
    expect(newTableRowText).not.toContain(newData.country);
  });

  it('shows country if countryType is international', () => {
    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={{ ...newData, countryType: COUNTRY_TYPES.INTERNATIONAL }}
        oldData={{ ...oldData, countryType: COUNTRY_TYPES.INTERNATIONAL }}
        options={{ ...options, isAddressChange: true }}
      />,
    );
    const oldTableRowText = wrapper
      .find('#contact_info_Old')
      .find('tbody tr')
      .text();

    expect(oldTableRowText).toContain(oldData.country);

    const newTableRowText = wrapper
      .find('#contact_info_New')
      .find('tbody tr')
      .text();
    expect(newTableRowText).toContain(newData.country);
  });
});
