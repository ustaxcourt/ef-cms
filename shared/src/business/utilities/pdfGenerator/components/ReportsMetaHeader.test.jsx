const React = require('react');
const { ReportsMetaHeader } = require('./ReportsMetaHeader.jsx');
const { shallow } = require('enzyme');

describe('ReportsMetaHeader', () => {
  it('renders the header title passed from props', () => {
    let wrapper = shallow(<ReportsMetaHeader headerTitle="Hello World" />);
    expect(wrapper.find('.header-title').text()).toEqual('Hello World');
  });
});
