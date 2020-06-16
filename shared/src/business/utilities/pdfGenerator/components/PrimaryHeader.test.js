const React = require('react');
const { PrimaryHeader } = require('./PrimaryHeader.jsx');
const { shallow } = require('enzyme');

describe('PrimaryHeader', () => {
  it('renders an h1 with United States Tax Court', () => {
    const wrapper = shallow(<PrimaryHeader />);

    const h1 = wrapper.find('.court-header h1');
    expect(h1.text()).toEqual('United States Tax Court');
  });

  it('renders the Tax Court address', () => {
    const wrapper = shallow(<PrimaryHeader />);

    const courtAddress = wrapper.find('.court-address');
    expect(courtAddress.text()).toEqual('Washington, DC 21207');
  });

  it('only renders an h2 element if h2 prop is provided', () => {
    let wrapper = shallow(<PrimaryHeader />);
    let h2 = wrapper.find('.court-header h2');
    expect(h2).toEqual({});

    wrapper = shallow(<PrimaryHeader h2="Test H2" />);
    h2 = wrapper.find('.court-header h2');
    expect(h2.text()).toEqual('Test H2');
  });
});
