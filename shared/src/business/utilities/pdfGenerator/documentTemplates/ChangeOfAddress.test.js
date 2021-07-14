const React = require('react');
const { ChangeOfAddress } = require('./ChangeOfAddress.jsx');
const { COUNTRY_TYPES } = require('../../../entities/EntityConstants.js');
const { shallow } = require('enzyme');

describe('ChangeOfAddress', () => {
  let options;
  let newData;
  let oldData;

  beforeEach(() => {
    newData = {
      address1: 'New Address 1',
      address2: 'New Address 2',
      address3: 'New Address 3',
      city: 'New City',
      country: 'USA',
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
      inCareOf: 'Test Care Of',
      phone: '123-124-1234',
      postalCode: '12345',
      state: 'AL',
    };

    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };
  });

  it('renders a table with the old contact information', () => {
    options.showAddressAndPhoneChange = true;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const table = wrapper.find('#contact_info_Old');
    expect(table.find('thead tr th').text()).toEqual('Old Contact Information');
    expect(table.find('tbody tr').text()).toContain(`c/o ${oldData.inCareOf}`);
    expect(table.find('tbody tr').text()).toContain(oldData.address1);
    expect(table.find('tbody tr').text()).toContain(oldData.address2);
    expect(table.find('tbody tr').text()).toContain(oldData.address3);
    expect(table.find('tbody tr').text()).toContain(oldData.city);
    expect(table.find('tbody tr').text()).toContain(oldData.state);
    expect(table.find('tbody tr').text()).toContain(oldData.postalCode);
    expect(table.find('tbody tr').text()).toContain(oldData.country);
    expect(table.find('tbody tr').text()).toContain(oldData.phone);
  });

  it('renders a table with the new contact information', () => {
    options.showAddressAndPhoneChange = true;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const table = wrapper.find('#contact_info_New');
    expect(table.find('thead tr th').text()).toEqual('New Contact Information');
    expect(table.find('tbody tr').text()).toContain(`c/o ${newData.inCareOf}`);
    expect(table.find('tbody tr').text()).toContain(newData.address1);
    expect(table.find('tbody tr').text()).toContain(newData.address2);
    expect(table.find('tbody tr').text()).toContain(newData.address3);
    expect(table.find('tbody tr').text()).toContain(newData.city);
    expect(table.find('tbody tr').text()).toContain(newData.state);
    expect(table.find('tbody tr').text()).toContain(newData.postalCode);
    expect(table.find('tbody tr').text()).toContain(newData.country);
    expect(table.find('tbody tr').text()).toContain(newData.phone);
  });

  it('only displays a phone number change if options.showOnlyPhoneChange is true', () => {
    options.showOnlyPhoneChange = true;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    expect(oldTable.find('thead tr th').text()).toEqual(
      'Old Contact Information',
    );

    expect(oldTable.find('tbody tr').text()).toContain(oldData.phone);

    expect(oldTable.find('tbody tr').text()).not.toContain(
      `c/o ${oldData.inCareOf}`,
    );
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.address1);
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.address2);
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.address3);
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.city);
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.state);
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.postalCode);
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.country);

    const newTable = wrapper.find('#contact_info_New');
    expect(newTable.find('thead tr th').text()).toEqual(
      'New Contact Information',
    );

    expect(newTable.find('tbody tr').text()).toContain(newData.phone);

    expect(newTable.find('tbody tr').text()).not.toContain(
      `c/o ${newData.inCareOf}`,
    );
    expect(newTable.find('tbody tr').text()).not.toContain(newData.address1);
    expect(newTable.find('tbody tr').text()).not.toContain(newData.address2);
    expect(newTable.find('tbody tr').text()).not.toContain(newData.address3);
    expect(newTable.find('tbody tr').text()).not.toContain(newData.city);
    expect(newTable.find('tbody tr').text()).not.toContain(newData.state);
    expect(newTable.find('tbody tr').text()).not.toContain(newData.postalCode);
    expect(newTable.find('tbody tr').text()).not.toContain(newData.country);
  });

  it('only displays an address change if options.showOnlyPhoneChange  and options.showAddressAndPhoneChange are falsy', () => {
    options.showOnlyPhoneChange = false;
    options.showAddressAndPhoneChange = false;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    expect(oldTable.find('thead tr th').text()).toEqual(
      'Old Contact Information',
    );

    expect(oldTable.find('tbody tr').text()).toContain(
      `c/o ${oldData.inCareOf}`,
    );
    expect(oldTable.find('tbody tr').text()).toContain(oldData.address1);
    expect(oldTable.find('tbody tr').text()).toContain(oldData.address2);
    expect(oldTable.find('tbody tr').text()).toContain(oldData.address3);
    expect(oldTable.find('tbody tr').text()).toContain(oldData.city);
    expect(oldTable.find('tbody tr').text()).toContain(oldData.state);
    expect(oldTable.find('tbody tr').text()).toContain(oldData.postalCode);
    expect(oldTable.find('tbody tr').text()).toContain(oldData.country);

    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.phone);

    const newTable = wrapper.find('#contact_info_New');
    expect(newTable.find('thead tr th').text()).toEqual(
      'New Contact Information',
    );

    expect(newTable.find('tbody tr').text()).toContain(
      `c/o ${newData.inCareOf}`,
    );
    expect(newTable.find('tbody tr').text()).toContain(newData.address1);
    expect(newTable.find('tbody tr').text()).toContain(newData.address2);
    expect(newTable.find('tbody tr').text()).toContain(newData.address3);
    expect(newTable.find('tbody tr').text()).toContain(newData.city);
    expect(newTable.find('tbody tr').text()).toContain(newData.state);
    expect(newTable.find('tbody tr').text()).toContain(newData.postalCode);
    expect(newTable.find('tbody tr').text()).toContain(newData.country);

    expect(newTable.find('tbody tr').text()).not.toContain(newData.phone);
  });

  it('does not show inCareOf if not provided in the old or new data', () => {
    options.showAddressAndPhoneChange = true;

    delete newData.inCareOf;
    delete oldData.inCareOf;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    expect(oldTable.find('tbody tr').text()).not.toContain(
      `c/o ${oldData.inCareOf}`,
    );

    const newTable = wrapper.find('#contact_info_New');
    expect(newTable.find('tbody tr').text()).not.toContain(
      `c/o ${newData.inCareOf}`,
    );
  });

  it('does not show city if not provided in the old or new data', () => {
    options.showAddressAndPhoneChange = true;

    delete newData.city;
    delete oldData.city;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.city);

    const newTable = wrapper.find('#contact_info_New');
    expect(newTable.find('tbody tr').text()).not.toContain(newData.city);
  });

  it('does not show country if not provided in the old or new data', () => {
    options.showAddressAndPhoneChange = true;

    delete newData.country;
    delete oldData.country;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.country);

    const newTable = wrapper.find('#contact_info_New');
    expect(newTable.find('tbody tr').text()).not.toContain(newData.country);
  });

  it('does not show country if countryType is domestic', () => {
    options.showAddressAndPhoneChange = true;

    oldData.countryType = COUNTRY_TYPES.DOMESTIC;
    newData.countryType = COUNTRY_TYPES.DOMESTIC;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    expect(oldTable.find('tbody tr').text()).not.toContain(oldData.country);

    const newTable = wrapper.find('#contact_info_New');
    expect(newTable.find('tbody tr').text()).not.toContain(newData.country);
  });

  it('shows country if countryType is international', () => {
    options.showAddressAndPhoneChange = true;

    oldData.countryType = COUNTRY_TYPES.INTERNATIONAL;
    newData.countryType = COUNTRY_TYPES.INTERNATIONAL;

    const wrapper = shallow(
      <ChangeOfAddress
        name="Joe Exotic"
        newData={newData}
        oldData={oldData}
        options={options}
      />,
    );
    const oldTable = wrapper.find('#contact_info_Old');
    expect(oldTable.find('tbody tr').text()).toContain(oldData.country);

    const newTable = wrapper.find('#contact_info_New');
    expect(newTable.find('tbody tr').text()).toContain(newData.country);
  });
});
