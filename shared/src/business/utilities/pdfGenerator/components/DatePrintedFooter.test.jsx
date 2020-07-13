const React = require('react');
const { DatePrintedFooter } = require('./DatePrintedFooter.jsx');
const { shallow } = require('enzyme');

describe('DatePrintedFooter', () => {
  it('renders the date from props', () => {
    let wrapper = shallow(<DatePrintedFooter datePrinted={'01/01/20'} />);
    expect(wrapper.find('.date-printed-footer').text()).toEqual(
      'Printed 01/01/20',
    );
  });
});
