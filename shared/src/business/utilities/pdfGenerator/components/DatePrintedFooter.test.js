const React = require('react');
const { DatePrintedFooter } = require('./DatePrintedFooter.jsx');
const { shallow } = require('enzyme');

describe('DatePrintedFooter', () => {
  it('renders the given dateServed from props', () => {
    let wrapper = shallow(<DatePrintedFooter datePrinted="01/01/20" />);
    expect(wrapper.text()).toContain('Printed 01/01/20');
  });
});
