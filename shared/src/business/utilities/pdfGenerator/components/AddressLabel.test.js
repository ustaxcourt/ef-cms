const React = require('react');
const { AddressLabel } = require('./AddressLabel.jsx');
const { shallow } = require('enzyme');

describe('AddressLabel', () => {
  it('renders the name and address', () => {
    const wrapper = shallow(
      <AddressLabel
        address1="123 Some Street"
        city="Some City"
        countryName="USA"
        name="Test Person"
        postalCode="89890"
        state="ZZ"
      />,
    );

    expect(wrapper.text()).toContain('123 Some Street');
    expect(wrapper.text()).toContain('Some City');
    expect(wrapper.text()).toContain('USA');
    expect(wrapper.text()).toContain('Test Person');
    expect(wrapper.text()).toContain('89890');
    expect(wrapper.text()).toContain('ZZ');
  });

  it('renders optional address information if present', () => {
    const wrapper = shallow(
      <AddressLabel
        additionalName="Test Additional Name"
        address1="123 Some Street"
        address2="address two"
        address3="address three"
        city="Some City"
        inCareOf="Care"
        name="Test Person"
        postalCode="89890"
        secondaryName="Secondary"
        state="ZZ"
        title="The Title"
      />,
    );

    expect(wrapper.text()).toContain('address two');
    expect(wrapper.text()).toContain('address three');
    expect(wrapper.text()).not.toContain('USA');
    expect(wrapper.text()).toContain('Secondary');
    expect(wrapper.text()).toContain('The Title');
    expect(wrapper.text()).toContain('Care');
    expect(wrapper.text()).toContain('Test Additional Name');
  });
});
