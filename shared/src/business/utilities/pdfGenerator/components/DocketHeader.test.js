const React = require('react');
const { DocketHeader } = require('./DocketHeader.jsx');
const { shallow } = require('enzyme');

describe('DocketHeader', () => {
  it('renders the case caption from props', () => {
    let wrapper = shallow(<DocketHeader caseTitle="Test Petitioner" />);
    expect(wrapper.find('#caption-title').text()).toEqual('Test Petitioner');
  });

  it('renders the case caption extension from props', () => {
    let wrapper = shallow(
      <DocketHeader caseCaptionExtension="Petitioner(s)" />,
    );
    expect(wrapper.find('#caption-extension').text()).toEqual('Petitioner(s)');
  });

  it('renders the case caption postfix', () => {
    const wrapper = shallow(<DocketHeader />);

    expect(wrapper.find('#caption-v').text()).toEqual('v.');
    expect(wrapper.find('#caption-commissioner').text()).toEqual(
      'Commissioner of Internal Revenue',
    );
    expect(wrapper.find('#caption-respondent').text()).toEqual('Respondent');
  });

  it('renders the docket number from props', () => {
    let wrapper = shallow(<DocketHeader docketNumberWithSuffix="123-45S" />);
    expect(wrapper.find('#docket-number').text()).toEqual('Docket No. 123-45S');
  });

  it('only renders an h3 element if h3 prop is provided', () => {
    let wrapper = shallow(<DocketHeader />);
    let h3 = wrapper.find('.case-information h3');
    expect(h3).toEqual({});

    wrapper = shallow(<DocketHeader h3="Test H3" />);
    h3 = wrapper.find('.case-information h3');
    expect(h3.text()).toEqual('Test H3');
  });
});
