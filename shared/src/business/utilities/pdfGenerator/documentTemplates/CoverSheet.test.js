const React = require('react');
const { CoverSheet } = require('./CoverSheet.jsx');
const { shallow } = require('enzyme');
import { PARTY_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';

describe('CoverSheet', () => {
  it('renders a document header with case information', () => {
    const wrapper = shallow(
      <CoverSheet
        caseCaptionExtension="Petitioner"
        caseTitle="Captain Fantastic"
        docketNumberWithSuffix="123-45S"
      />,
    );

    expect(wrapper.find('#caption-title').text()).toEqual('Captain Fantastic');
    expect(wrapper.find('#caption-extension').text()).toEqual(
      PARTY_TYPES.petitioner,
    );
    expect(wrapper.find('#docket-number').text()).toContain(
      'Docket No. 123-45S',
    );
  });

  it('renders the received date', () => {
    const wrapper = shallow(<CoverSheet dateReceived="01/01/2020" />);
    const text = wrapper.find('#date-received').text();

    expect(text).toContain('Received');
    expect(text).toContain('01/01/2020');
  });

  it('renders a filed or lodged label along with the associated date', () => {
    const wrapper = shallow(
      <CoverSheet
        dateFiledLodged="02/02/2020"
        dateFiledLodgedLabel="Some Label"
      />,
    );
    const text = wrapper.find('#filed-or-lodged').text();

    expect(text).toContain('Some Label');
    expect(text).toContain('02/02/2020');
  });

  it('renders Electronically Filed if the case was filed electronically', () => {
    let wrapper = shallow(<CoverSheet electronicallyFiled={false} />);

    expect(wrapper.find('#docket-number').text()).not.toContain(
      'Electronically Filed',
    );

    wrapper = shallow(<CoverSheet electronicallyFiled={true} />);

    expect(wrapper.find('#docket-number').text()).toContain(
      'Electronically Filed',
    );
  });

  it('renders the mailingDate if provided', () => {
    let wrapper = shallow(<CoverSheet />);

    expect(wrapper.find('#docket-number').text()).not.toContain('12/1/2019');

    wrapper = shallow(<CoverSheet mailingDate="12/1/2019" />);

    expect(wrapper.find('#docket-number').text()).toContain('12/1/2019');
  });

  it('renders Certificate of Service of there is a certificateOfService', () => {
    let wrapper = shallow(<CoverSheet certificateOfService={false} />);

    expect(wrapper.find('#certificate-of-service').length).toEqual(0);

    wrapper = shallow(<CoverSheet certificateOfService={true} />);

    expect(wrapper.find('#certificate-of-service').length).toEqual(1);
  });
});
