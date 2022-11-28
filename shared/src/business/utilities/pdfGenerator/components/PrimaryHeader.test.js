const React = require('react');
const { PrimaryHeader } = require('./PrimaryHeader.jsx');
const { shallow } = require('enzyme');

describe('PrimaryHeader', () => {
  it('renders an h1 with United States Tax Court', () => {
    const wrapper = shallow(<PrimaryHeader />);

    const h1 = wrapper.find('#primary-header h1');
    expect(h1.text()).toEqual('United States Tax Court');
  });

  it('renders the Tax Court address', () => {
    const wrapper = shallow(<PrimaryHeader />);

    const courtAddress = wrapper.find('.court-address');
    expect(courtAddress.text()).toEqual('Washington, DC 20217');
  });
});
