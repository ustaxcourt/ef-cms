const React = require('react');
const { mount } = require('enzyme');
const { Order } = require('./Order.jsx');

describe('Order', () => {
  let options;
  let orderContent;
  let orderTitle;

  beforeAll(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };

    orderContent = '<p>This is some order content</p>';
    orderTitle = 'Test Order Title';
  });

  it('renders a document header with case information', () => {
    const wrapper = mount(<Order options={options} />);

    expect(wrapper.find('#caption-title').text()).toEqual(options.caseTitle);
    expect(wrapper.find('#caption-extension').text()).toEqual(
      options.caseCaptionExtension,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket No. ${options.docketNumberWithSuffix}`,
    );
  });

  it('renders a document title', () => {
    const wrapper = mount(<Order options={options} orderTitle={orderTitle} />);

    expect(wrapper.find('.case-information h3').text()).toEqual(orderTitle);
  });

  it('renders the order content', () => {
    const wrapper = mount(
      <Order
        options={options}
        orderContent={orderContent}
        orderTitle={orderTitle}
      />,
    );

    expect(wrapper.find('#order-content').text()).toEqual(
      'This is some order content',
    );
  });

  it('renders a signature if provided', () => {
    let wrapper = mount(
      <Order
        options={options}
        orderContent={orderContent}
        orderTitle={orderTitle}
        signatureText=""
      />,
    );
    expect(wrapper.find('#order-signature').length).toEqual(0);

    wrapper = mount(
      <Order
        options={options}
        orderContent={orderContent}
        orderTitle={orderTitle}
        signatureText="Test Signature"
      />,
    );
    expect(wrapper.find('#order-signature').text()).toContain('Test Signature');
  });
});
