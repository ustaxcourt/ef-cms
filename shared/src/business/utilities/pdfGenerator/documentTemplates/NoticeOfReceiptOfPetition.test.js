const React = require('react');
const {
  NoticeOfReceiptOfPetition,
} = require('./NoticeOfReceiptOfPetition.jsx');
const { mount, shallow } = require('enzyme');

describe('NoticeOfReceiptOfPetition', () => {
  const caseCaptionExtension = 'Petitioner(s)';
  const caseTitle = 'Test Petitioner';
  const docketNumberWithSuffix = '123-19S';
  const address = {
    address1: '123 Some St.',
    city: 'Somecity',
    countryName: '',
    inCareOf: 'Who',
    name: 'Test Petitioner',
    postalCode: '80008',
    secondaryName: 'What',
    state: 'ZZ',
    title: 'When',
  };

  it('renders a document header with case information', () => {
    const wrapper = mount(
      <NoticeOfReceiptOfPetition
        address={address}
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
      />,
    );

    expect(wrapper.find('#caption').text()).toContain(caseTitle);
    expect(wrapper.find('#caption').text()).toContain(caseCaptionExtension);
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket No. ${docketNumberWithSuffix}`,
    );
    expect(wrapper.find('h3').at(0).text()).toEqual(
      'Notice of Receipt of Petition',
    );
  });

  it('renders the case information', () => {
    const wrapper = shallow(
      <NoticeOfReceiptOfPetition
        address={address}
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        preferredTrialCity="Birmingham, AL"
        receivedAtFormatted="December 1, 2019"
        servedDate="June 3, 2020"
      />,
    );
    const textContent = wrapper.text();
    expect(textContent).toContain(docketNumberWithSuffix);
    expect(textContent).toContain('Birmingham, AL');
    expect(textContent).toContain('December 1, 2019');
    expect(textContent).toContain('June 3, 2020');
  });

  it('does not render Request for Place of Trial section if preferredTrialCity is not present', () => {
    const wrapper = shallow(
      <NoticeOfReceiptOfPetition
        address={address}
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        receivedAtFormatted="December 1, 2019"
        servedDate="June 3, 2020"
      />,
    );
    const textContent = wrapper.text();
    expect(textContent).not.toContain('Request for Place of Trial');
  });

  it('renders the petitioner mailing address', () => {
    const wrapper = mount(
      <NoticeOfReceiptOfPetition
        address={address}
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        preferredTrialCity="Birmingham, AL"
        receivedAtFormatted="December 1, 2019"
        servedDate="June 3, 2020"
      />,
    );
    const textContent = wrapper.text();
    expect(textContent).toContain(address.name);
    expect(textContent).toContain(address.address1);
    expect(textContent).toContain(address.city);
    expect(textContent).toContain(address.state);
    expect(textContent).toContain(address.postalCode);
    expect(textContent).toContain(address.inCareOf);
    expect(textContent).toContain(address.secondaryName);
    expect(textContent).toContain(address.title);
  });
});
