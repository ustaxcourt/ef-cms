const React = require('react');
const { mount, shallow } = require('enzyme');
const { NoticeOfDocketChange } = require('./NoticeOfDocketChange.jsx');

describe('NoticeOfDocketChange', () => {
  let options;
  let filingParties;
  let filingsAndProceedings;

  beforeEach(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };

    filingParties = {
      after: 'Party After',
      before: 'Party Before',
    };

    filingsAndProceedings = {
      after: 'Filing and Proceedings After',
      before: 'Filing and Proceedings Before',
    };
  });

  it('renders a document header with case information', () => {
    const wrapper = mount(
      <NoticeOfDocketChange
        docketEntryIndex="1"
        filingParties={filingParties}
        filingsAndProceedings={filingsAndProceedings}
        options={options}
      />,
    );

    expect(wrapper.find('#caption-title').text()).toEqual(options.caseTitle);
    expect(wrapper.find('#caption-extension').text()).toEqual(
      options.caseCaptionExtension,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket No. ${options.docketNumberWithSuffix}`,
    );
    expect(wrapper.find('h3').at(0).text()).toEqual('Notice of Docket Change');
  });

  it('displays the docket entry index', () => {
    const wrapper = shallow(
      <NoticeOfDocketChange
        docketEntryIndex="1"
        filingParties={filingParties}
        filingsAndProceedings={filingsAndProceedings}
        options={options}
      />,
    );

    expect(wrapper.find('.card .card-header').text()).toEqual(
      'Docket Entry No. 1 has been changed',
    );
  });

  it('displays filings and proceedings changes if they have been updated', () => {
    const wrapper = shallow(
      <NoticeOfDocketChange
        docketEntryIndex="1"
        filingParties={filingParties}
        filingsAndProceedings={filingsAndProceedings}
        options={options}
      />,
    );

    expect(wrapper.find('#changed-filings-and-proceedings').text()).toEqual(
      `"${filingsAndProceedings.before}" has been changed to "${filingsAndProceedings.after}".`,
    );
  });

  it('does NOT display filings and proceedings changes if they have NOT been updated', () => {
    filingsAndProceedings.after = filingsAndProceedings.before;

    const wrapper = shallow(
      <NoticeOfDocketChange
        docketEntryIndex="1"
        filingParties={filingParties}
        filingsAndProceedings={filingsAndProceedings}
        options={options}
      />,
    );

    expect(wrapper.find('#changed-filings-and-proceedings').length).toEqual(0);
  });

  it('displays filing parties changes if they have been updated', () => {
    const wrapper = shallow(
      <NoticeOfDocketChange
        docketEntryIndex="1"
        filingParties={filingParties}
        filingsAndProceedings={filingsAndProceedings}
        options={options}
      />,
    );

    expect(wrapper.find('#changed-filing-parties').text()).toEqual(
      `"${filingParties.before}" has been changed to "${filingParties.after}".`,
    );
  });

  it('does NOT display filing parties changes if they have NOT been updated', () => {
    filingParties.after = filingParties.before;

    const wrapper = shallow(
      <NoticeOfDocketChange
        docketEntryIndex="1"
        filingParties={filingParties}
        filingsAndProceedings={filingsAndProceedings}
        options={options}
      />,
    );

    expect(wrapper.find('#changed-filing-parties').length).toEqual(0);
  });
});
