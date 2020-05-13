const React = require('react');
const { ReportsHeader } = require('./ReportsHeader.jsx');
const { shallow } = require('enzyme');

describe('ReportsHeader', () => {
  it('renders the title from props in an h1 tag', () => {
    let wrapper = shallow(
      <ReportsHeader subtitle="Report Sub-Title" title="Report Title" />,
    );
    expect(wrapper.find('h2').text()).toEqual('Report Title');
  });

  it('renders the subtitle from props in an h2 tag', () => {
    let wrapper = shallow(
      <ReportsHeader subtitle="Report Sub-Title" title="Report Title" />,
    );
    expect(wrapper.find('h3').text()).toEqual('Report Sub-Title');
  });
});
