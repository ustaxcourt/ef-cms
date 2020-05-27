const PageMetaHeaderDocket = require('./PageMetaHeaderDocket.jsx').default;
const React = require('react');
const { shallow } = require('enzyme');

describe('PageMetaHeaderDocket', () => {
  it('renders the docket number from props', () => {
    let wrapper = shallow(<PageMetaHeaderDocket docketNumber="123-45" />);
    expect(wrapper.text()).toContain('Docket Number: 123-45');
  });
});
