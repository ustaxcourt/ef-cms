const React = require('react');
const { EmailHeader } = require('./EmailHeader.jsx');
const { shallow } = require('enzyme');

describe('EmailHeader', () => {
  it('renders a header with US Tax Court info', () => {
    let wrapper = shallow(<EmailHeader />);

    expect(wrapper.text()).toContain('United States Tax Court');
    expect(wrapper.text()).toContain('Washington, DC 21207');
  });

  it('renders the date from props if present', () => {
    let wrapper = shallow(<EmailHeader date={'May 14, 2020'} />);

    expect(wrapper.text()).toContain('May 14, 2020');
  });
});
