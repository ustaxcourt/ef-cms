const PDFDocumentHeader = require('./PDFDocumentHeader.jsx').default;
const React = require('react');
const { shallow } = require('enzyme');

describe('PDFDocumentHeader', () => {
  it('renders an h1 with United States Tax Court', () => {
    const wrapper = shallow(<PDFDocumentHeader />);

    const h1 = wrapper.find('.court-header h1');
    expect(h1.text()).toEqual('United States Tax Court');
  });

  it('renders the case caption from props', () => {
    let wrapper = shallow(
      <PDFDocumentHeader caseCaptionWithPostfix="Test Case Caption" />,
    );
    expect(wrapper.find('#caption').text()).toEqual('Test Case Caption');
  });

  it('renders the docket number from props', () => {
    let wrapper = shallow(
      <PDFDocumentHeader docketNumberWithSuffix="123-45S" />,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      'Docket Number 123-45S',
    );
  });

  it('only renders an h2 element if h2 prop is provided', () => {
    let wrapper = shallow(<PDFDocumentHeader />);
    let h2 = wrapper.find('.court-header h2');
    expect(h2).toEqual({});

    wrapper = shallow(<PDFDocumentHeader h2="Test H2" />);
    h2 = wrapper.find('.court-header h2');
    expect(h2.text()).toEqual('Test H2');
  });

  it('only renders an h3 element if h3 prop is provided', () => {
    let wrapper = shallow(<PDFDocumentHeader />);
    let h3 = wrapper.find('.case-information h3');
    expect(h3).toEqual({});

    wrapper = shallow(<PDFDocumentHeader h3="Test H3" />);
    h3 = wrapper.find('.case-information h3');
    expect(h3.text()).toEqual('Test H3');
  });
});
