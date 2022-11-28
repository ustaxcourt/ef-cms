const React = require('react');
const { DateServedFooter } = require('./DateServedFooter.jsx');
const { shallow } = require('enzyme');

describe('DateServedFooter', () => {
  it('renders the given dateServed from props', () => {
    let wrapper = shallow(<DateServedFooter dateServed="01/01/2020" />);
    expect(wrapper.text()).toContain('SERVED 01/01/2020');
  });
});
