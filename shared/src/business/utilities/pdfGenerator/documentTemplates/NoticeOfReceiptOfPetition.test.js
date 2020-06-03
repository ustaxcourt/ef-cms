const React = require('react');
const {
  NoticeOfReceiptOfPetition,
} = require('./NoticeOfReceiptOfPetition.jsx');
const { mount, shallow } = require('enzyme');

describe('NoticeOfReceiptOfPetition', () => {
  const caseCaptionExtension = 'Petitioner(s)';
  const caseTitle = 'Test Petitioner';
  const docketNumberWithSuffix = '123-19S';

  it('renders a document header with case information', () => {
    const wrapper = mount(
      <NoticeOfReceiptOfPetition
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
      />,
    );

    expect(wrapper.find('#caption').text()).toContain(caseTitle);
    expect(wrapper.find('#caption').text()).toContain(caseCaptionExtension);
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket Number ${docketNumberWithSuffix}`,
    );
    expect(wrapper.find('h3').at(0).text()).toEqual(
      'NOTIFICATION OF RECEIPT OF PETITION',
    );
  });

  it('renders the case information', () => {
    const wrapper = shallow(
      <NoticeOfReceiptOfPetition
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
});
