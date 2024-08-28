import { DOCUMENT_EXTERNAL_CATEGORIES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { completeDocumentTypeSectionHelper as completeDocumentTypeSectionHelperComputed } from './completeDocumentTypeSectionHelper';
import {
  irsPractitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const completeDocumentTypeSectionHelper = withAppContextDecorator(
  completeDocumentTypeSectionHelperComputed,
  applicationContext,
);

describe('completeDocumentTypeSectionHelper', () => {
  it("should return an empty object given there's no caseDetail", () => {
    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {},
        form: {},
        user: privatePractitionerUser,
      },
    });

    expect(result).toEqual({});
  });

  it('returns document info with a primary document only', () => {
    const categoryKey = 'Application';
    const categoryIdx = 0;

    const { category, documentType } =
      DOCUMENT_EXTERNAL_CATEGORIES_MAP[categoryKey][categoryIdx];

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        form: {
          category,
          documentType,
        },
        user: privatePractitionerUser,
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.primary.showNonstandardForm).toBe(false);
  });

  it('returns document info with primary and secondaryDocument info', () => {
    const categoryKey = 'Motion';

    const { category, documentType } = DOCUMENT_EXTERNAL_CATEGORIES_MAP[
      categoryKey
    ].find(document => document.documentType === 'Motion for Leave to File');

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        form: {
          category,
          documentType,
          secondaryDocument: {
            category: 'Motion',
            documentType: 'Motion for Leave to File',
          },
        },
        user: privatePractitionerUser,
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.secondary).toBeTruthy();
    expect(result.primary.showNonstandardForm).toBe(true);
    expect(result.primary.showSecondaryDocumentSelect).toBe(false);
  });

  it('returns an array of documentTypes for select sans [NCA, NCP, NCAP, DSC]', () => {
    const categoryKey = 'Application';
    const categoryIdx = 0;

    const { category } =
      DOCUMENT_EXTERNAL_CATEGORIES_MAP[categoryKey][categoryIdx];

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        form: {
          category,
        },
        user: privatePractitionerUser,
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeDefined();
    expect(result.documentTypesForSelectSorted.length).toBeGreaterThan(0);
    expect(result.documentTypesForSelectSorted).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventCode: 'DSC',
        }),
        expect.objectContaining({
          eventCode: 'NCA',
        }),
        expect.objectContaining({
          eventCode: 'NCP',
        }),
        expect.objectContaining({
          eventCode: 'NCAP',
        }),
      ]),
    );
  });

  it('returns an array of documentTypes for select including Entry of Appearance for IRS Practitioners on first filing', () => {
    applicationContext.getUtilities().isSealedCase = jest
      .fn()
      .mockReturnValue(false);

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        form: {},
        user: irsPractitionerUser,
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeDefined();
    expect(result.documentTypesForSelectSorted.length).toBeGreaterThan(0);
    expect(result.documentTypesForSelectSorted).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Entry of Appearance for Respondent',
          eventCode: 'EA',
        }),
      ]),
    );
  });

  it('returns an array of documentTypes for select that only contains documents with canBeFirstIrsDocument for IRS Pracitioners on filing first IRS document', () => {
    applicationContext.getUtilities().isSealedCase = jest
      .fn()
      .mockReturnValue(false);

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        form: {},
        user: irsPractitionerUser,
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeDefined();
    expect(result.documentTypesForSelectSorted.length).toBeGreaterThan(0);
    expect(
      result.documentTypesForSelectSorted.every(
        entry => entry.canBeFirstIrsDocument === true,
      ),
    ).toBeTruthy();
  });

  it('returns an array of documentTypes for select excluding Entry of Appearance for IRS Practitioners on non-first filing', () => {
    applicationContext.getUtilities().isSealedCase = jest
      .fn()
      .mockReturnValue(false);

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
          irsPractitioners: [{ thing: 'thing' }],
        },
        form: {},
        user: irsPractitionerUser,
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeDefined();
    expect(result.documentTypesForSelectSorted.length).toBeGreaterThan(0);
    expect(result.documentTypesForSelectSorted).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ eventCode: 'EA' })]),
    );
  });

  it('returns an array of documentTypes for select excluding Entry of Appearance for IRS Practitioners on sealed case', () => {
    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
          isSealed: true,
        },
        form: {},
        user: irsPractitionerUser,
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeDefined();
    expect(result.documentTypesForSelectSorted.length).toBeGreaterThan(0);
    expect(result.documentTypesForSelectSorted).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ eventCode: 'EA' })]),
    );
  });
});
