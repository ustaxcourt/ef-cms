import {
  PAGE_SIZE,
  practitionerInformationHelper as practitionerInformationHelperComputed,
} from './practitionerInformationHelper';
import {
  PRACTICE_TYPE,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { PractitionerDetail } from '@web-client/presenter/state';
import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { v4 } from 'uuid';
import { withAppContextDecorator } from '../../withAppContext';

describe('practitionerInformationHelper', () => {
  // Helper function to make a lot of cases in order to test pagination
  const getFakeCase = () => {
    return {
      caseTitle: `Case Title ${v4()}`,
      docketNumberWithSuffix: `Docket Number ${v4()}`,
      status: 'Test',
    };
  };

  const getFakeCases = (howMany: number) => {
    const cases: any = [];
    for (let i = 0; i < howMany; i++) {
      cases.push(getFakeCase());
    }
    return cases;
  };

  const getMockedPractitionerDetail = ({
    closedCasesCurrentPage = 0,
    numClosedCases = 0,
    numOpenCases = 0,
    openCasesCurrentPage = 0,
  }: {
    numClosedCases?: number;
    numOpenCases?: number;
    openCasesCurrentPage?: number;
    closedCasesCurrentPage?: number;
  }): PractitionerDetail => {
    return {
      admissionStatus: 'Test',
      admissionsDate: '2019-03-01',
      barNumber: '1234',
      birthYear: '1939',
      closedCaseInfo: {
        allCases: getFakeCases(numClosedCases),
        currentPage: closedCasesCurrentPage,
      },
      name: 'Pierre Menard',
      openCaseInfo: {
        allCases: getFakeCases(numOpenCases),
        currentPage: openCasesCurrentPage,
      },
      practiceType: PRACTICE_TYPE.DOJ,
      userId: '1234',
    };
  };

  const practitionerInformationHelper = withAppContextDecorator(
    practitionerInformationHelperComputed,
    {
      ...applicationContext,
    },
  );

  it('should test return the correct permission from state', () => {
    const { showDocumentationTab } = runCompute(practitionerInformationHelper, {
      state: {
        permissions: {
          UPLOAD_PRACTITIONER_DOCUMENT: true,
        },
        practitionerDetail: getMockedPractitionerDetail({}),
        user: { role: ROLES.admissionsClerk },
      },
    });

    expect(showDocumentationTab).toBe(true);
  });

  it('should calculate correct total number of open cases', () => {
    const numOpenCases = 7;
    const { openCasesTotal } = runCompute(practitionerInformationHelper, {
      state: {
        permissions: {
          UPLOAD_PRACTITIONER_DOCUMENT: true,
        },
        practitionerDetail: getMockedPractitionerDetail({ numOpenCases }),
        user: { role: ROLES.admissionsClerk },
      },
    });

    expect(openCasesTotal).toBe(numOpenCases);
  });

  it('should calculate correct total number of closed cases', () => {
    const numClosedCases = 0;
    const { closedCasesTotal } = runCompute(practitionerInformationHelper, {
      state: {
        permissions: {
          UPLOAD_PRACTITIONER_DOCUMENT: true,
        },
        practitionerDetail: getMockedPractitionerDetail({ numClosedCases }),
        user: { role: ROLES.admissionsClerk },
      },
    });

    expect(closedCasesTotal).toBe(numClosedCases);
  });

  it.each([
    [0, 0],
    [1, 1],
    [PAGE_SIZE, 1],
    [PAGE_SIZE + 1, 2],
    [PAGE_SIZE * 2 + 1, 3],
  ])(
    'should calculate correct total number of open case pagination pages for %s total cases',
    (input, output) => {
      const { totalOpenCasesPages } = runCompute(
        practitionerInformationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
            practitionerDetail: getMockedPractitionerDetail({
              numOpenCases: input,
            }),
            user: { role: ROLES.admissionsClerk },
          },
        },
      );

      expect(totalOpenCasesPages).toBe(output);
    },
  );

  it.each([
    [0, 0],
    [1, 1],
    [PAGE_SIZE, 1],
    [PAGE_SIZE + 1, 2],
    [PAGE_SIZE * 2 + 1, 3],
  ])(
    'should calculate correct total number of closed case pagination pages for %s total cases',
    (input, output) => {
      const { totalClosedCasesPages } = runCompute(
        practitionerInformationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
            practitionerDetail: getMockedPractitionerDetail({
              numClosedCases: input,
            }),
            user: { role: ROLES.admissionsClerk },
          },
        },
      );

      expect(totalClosedCasesPages).toBe(output);
    },
  );

  it('should set showOpenCasesPagination to true when there is more than 1 open case page', () => {
    const numOpenCases = PAGE_SIZE + 1;
    const { showOpenCasesPagination } = runCompute(
      practitionerInformationHelper,
      {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: true,
          },
          practitionerDetail: getMockedPractitionerDetail({ numOpenCases }),
          user: { role: ROLES.admissionsClerk },
        },
      },
    );

    expect(showOpenCasesPagination).toBe(true);
  });

  it('should set showClosedCasesPagination to true when there is more than 1 open case page', () => {
    const numClosedCases = PAGE_SIZE + 1;
    const { showClosedCasesPagination } = runCompute(
      practitionerInformationHelper,
      {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: true,
          },
          practitionerDetail: getMockedPractitionerDetail({ numClosedCases }),
          user: { role: ROLES.admissionsClerk },
        },
      },
    );

    expect(showClosedCasesPagination).toBe(true);
  });

  it('should set showOpenCasesPagination to false if there are less than 2 open case pages', () => {
    const numOpenCases = 1;
    const { showOpenCasesPagination } = runCompute(
      practitionerInformationHelper,
      {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: true,
          },
          practitionerDetail: getMockedPractitionerDetail({ numOpenCases }),
          user: { role: ROLES.admissionsClerk },
        },
      },
    );

    expect(showOpenCasesPagination).toBe(false);
  });

  it('should set showClosedCasesPagination to false if there are less than 2 closed case pages', () => {
    const numClosedCases = 1;
    const { showClosedCasesPagination } = runCompute(
      practitionerInformationHelper,
      {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: true,
          },
          practitionerDetail: getMockedPractitionerDetail({ numClosedCases }),
          user: { role: ROLES.admissionsClerk },
        },
      },
    );

    expect(showClosedCasesPagination).toBe(false);
  });

  it('should get correct open cases to display', () => {
    const numOpenCases = PAGE_SIZE + 1;
    const mockedPractitionerDetail = getMockedPractitionerDetail({
      numOpenCases,
    });

    const expectedDocketNumbers = [
      mockedPractitionerDetail
        .openCaseInfo!.allCases.slice(0, PAGE_SIZE)
        .map(x => x.docketNumberWithSuffix),
      mockedPractitionerDetail
        .openCaseInfo!.allCases.slice(-1)
        .map(x => x.docketNumberWithSuffix),
    ];

    for (let page = 0; page < 2; page++) {
      const { openCasesToDisplay } = runCompute(practitionerInformationHelper, {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: true,
          },
          practitionerDetail: {
            ...mockedPractitionerDetail,
            openCaseInfo: {
              ...mockedPractitionerDetail.openCaseInfo,
              currentPage: page,
            },
          },
          user: { role: ROLES.admissionsClerk },
        },
      });

      expect(
        openCasesToDisplay.map(x => x.docketNumberWithSuffix),
      ).toMatchObject(expectedDocketNumbers[page]);
    }
  });

  it('should get correct closed cases to display', () => {
    const numClosedCases = PAGE_SIZE + 1;
    const mockedPractitionerDetail = getMockedPractitionerDetail({
      numClosedCases,
    });

    const expectedDocketNumbers = [
      mockedPractitionerDetail
        .closedCaseInfo!.allCases.slice(0, PAGE_SIZE)
        .map(x => x.docketNumberWithSuffix),
      mockedPractitionerDetail
        .closedCaseInfo!.allCases.slice(-1)
        .map(x => x.docketNumberWithSuffix),
    ];

    for (let page = 0; page < 2; page++) {
      const { closedCasesToDisplay } = runCompute(
        practitionerInformationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
            practitionerDetail: {
              ...mockedPractitionerDetail,
              closedCaseInfo: {
                ...mockedPractitionerDetail.closedCaseInfo,
                currentPage: page,
              },
            },
            user: { role: ROLES.admissionsClerk },
          },
        },
      );

      expect(
        closedCasesToDisplay.map(x => x.docketNumberWithSuffix),
      ).toMatchObject(expectedDocketNumbers[page]);
    }
  });
});
