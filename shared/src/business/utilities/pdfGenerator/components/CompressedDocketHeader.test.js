const React = require('react');
const { CompressedDocketHeader } = require('./CompressedDocketHeader.jsx');
const { shallow } = require('enzyme');

describe('CompressedDocketHeader', () => {
  it('renders the case caption from props', () => {
    let wrapper = shallow(
      <CompressedDocketHeader
        caseCaptionExtension="Petitioner"
        caseTitle="Test Petitioner"
      />,
    );
    expect(wrapper.find('#caption').text()).toEqual(
      'Test Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
    );
  });

  it('renders the docket number from props', () => {
    let wrapper = shallow(
      <CompressedDocketHeader docketNumberWithSuffix="123-45S" />,
    );
    expect(wrapper.find('#docket-number').text()).toEqual('Docket No. 123-45S');
  });

  it('only renders an h3 element if h3 prop is provided', () => {
    let wrapper = shallow(<CompressedDocketHeader />);
    let h3 = wrapper.find('.case-information h3');
    expect(h3).toEqual({});

    wrapper = shallow(<CompressedDocketHeader h3="Test H3" />);
    h3 = wrapper.find('.case-information h3');
    expect(h3.text()).toEqual('Test H3');
  });
});
