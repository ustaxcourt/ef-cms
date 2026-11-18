import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { PublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';
import { PublicContact } from '@shared/business/entities/cases/PublicContact';
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import joi from 'joi';

const publicEntityArray = (entityName: string): joi.ArraySchema =>
  joi
    .array()
    .items(
      joi
        .object({
          entityName: joi.string().valid(entityName).required(),
        })
        .unknown(),
    )
    .required();

export type PublicDocketEntriesPageResponseData = {
  docketEntries: PublicDocketEntry[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export class PublicDocketEntriesPageResponse extends JoiValidationEntity {
  public docketEntries: PublicDocketEntry[];
  public page: number;
  public pageSize: number;
  public totalCount: number;

  constructor(
    data: PublicDocketEntriesPageResponseData = {
      docketEntries: [],
      page: 0,
      pageSize: 1,
      totalCount: 0,
    },
  ) {
    super('PublicDocketEntriesPageResponse');
    this.docketEntries = data.docketEntries;
    this.page = data.page;
    this.pageSize = data.pageSize;
    this.totalCount = data.totalCount;
  }

  static VALIDATION_RULES = {
    docketEntries: publicEntityArray('PublicDocketEntry'),
    page: joi.number().integer().min(0).required(),
    pageSize: joi.number().integer().min(1).required(),
    totalCount: joi.number().integer().min(0).required(),
  };

  getValidationRules(): typeof PublicDocketEntriesPageResponse.VALIDATION_RULES {
    return PublicDocketEntriesPageResponse.VALIDATION_RULES;
  }
}

export type PublicCaseSearchResponseData = {
  results: PublicCaseSearchResult[];
};

export class PublicCaseSearchResponse extends JoiValidationEntity {
  public results: PublicCaseSearchResult[];

  constructor(data: PublicCaseSearchResponseData = { results: [] }) {
    super('PublicCaseSearchResponse');
    this.results = data.results;
  }

  static VALIDATION_RULES = {
    results: publicEntityArray('PublicCaseSearchResult'),
  };

  getValidationRules(): typeof PublicCaseSearchResponse.VALIDATION_RULES {
    return PublicCaseSearchResponse.VALIDATION_RULES;
  }
}

export type PublicDocumentSearchResponseData = {
  results: PublicDocumentSearchResult[];
};

export class PublicDocumentSearchResponse extends JoiValidationEntity {
  public results: PublicDocumentSearchResult[];

  constructor(data: PublicDocumentSearchResponseData = { results: [] }) {
    super('PublicDocumentSearchResponse');
    this.results = data.results;
  }

  static VALIDATION_RULES = {
    results: publicEntityArray('PublicDocumentSearchResult'),
  };

  getValidationRules(): typeof PublicDocumentSearchResponse.VALIDATION_RULES {
    return PublicDocumentSearchResponse.VALIDATION_RULES;
  }
}

export type PublicDocumentSearchPageResponseData = {
  results: PublicDocumentSearchResult[];
  totalCount: number;
};

export class PublicDocumentSearchPageResponse extends JoiValidationEntity {
  public results: PublicDocumentSearchResult[];
  public totalCount: number;

  constructor(
    data: PublicDocumentSearchPageResponseData = {
      results: [],
      totalCount: 0,
    },
  ) {
    super('PublicDocumentSearchPageResponse');
    this.results = data.results;
    this.totalCount = data.totalCount;
  }

  static VALIDATION_RULES = {
    results: publicEntityArray('PublicDocumentSearchResult'),
    totalCount: joi.number().integer().min(0).required(),
  };

  getValidationRules(): typeof PublicDocumentSearchPageResponse.VALIDATION_RULES {
    return PublicDocumentSearchPageResponse.VALIDATION_RULES;
  }
}

export type PublicPractitionerSearchResultsData = {
  lastKey: (string | number | null)[];
  practitioners: PublicContact[];
  total: number;
};

export class PublicPractitionerSearchResults extends JoiValidationEntity {
  public lastKey: (string | number | null)[];
  public practitioners: PublicContact[];
  public total: number;

  constructor(
    data: PublicPractitionerSearchResultsData = {
      lastKey: [],
      practitioners: [],
      total: 0,
    },
  ) {
    super('PublicPractitionerSearchResults');
    this.lastKey = data.lastKey;
    this.practitioners = data.practitioners;
    this.total = data.total;
  }

  static VALIDATION_RULES = {
    lastKey: joi
      .array()
      .items(
        joi
          .alternatives()
          .try(joi.string().strict(), joi.number().strict(), joi.valid(null)),
      )
      .required(),
    practitioners: publicEntityArray('PublicContact'),
    total: joi.number().integer().min(0).required(),
  };

  getValidationRules(): typeof PublicPractitionerSearchResults.VALIDATION_RULES {
    return PublicPractitionerSearchResults.VALIDATION_RULES;
  }
}

export type PublicPractitionerSearchResponseData = {
  searchResults: PublicPractitionerSearchResultsData;
};

export class PublicPractitionerSearchResponse extends JoiValidationEntity {
  public searchResults: PublicPractitionerSearchResultsData;

  constructor(
    data: PublicPractitionerSearchResponseData = {
      searchResults: {
        lastKey: [],
        practitioners: [],
        total: 0,
      },
    },
  ) {
    super('PublicPractitionerSearchResponse');
    this.searchResults = data.searchResults;
  }

  static VALIDATION_RULES = {
    searchResults: joi
      .object(PublicPractitionerSearchResults.VALIDATION_RULES)
      .required(),
  };

  getValidationRules(): typeof PublicPractitionerSearchResponse.VALIDATION_RULES {
    return PublicPractitionerSearchResponse.VALIDATION_RULES;
  }
}
