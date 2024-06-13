import { IApplicationContext } from 'types/IApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { formatResults } from '@web-api/persistence/elasticsearch/searchClient';

export const coldCaseReportInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const entriesOfNotAtIssueCases = await applicationContext
    .getSearchClient()
    .search({
      body: {
        _source: ['docketNumber', 'pending', 'filingDate'],
        query: {
          bool: {
            must: [
              {
                has_parent: {
                  inner_hits: {
                    _source: {
                      includes: ['docketNumber'],
                    },
                    name: 'case-mappings',
                  },
                  parent_type: 'case',
                  query: {
                    term: {
                      'status.S': 'General Docket - Not at Issue',
                    },
                  },
                },
              },
            ],
          },
        },
      },
      index: 'efcms-docket-entry',
      size: 10000,
    });

  const { results } = formatResults(entriesOfNotAtIssueCases.body);

  const cases = {};
  for (let entry of results) {
    if (!cases[entry.docketNumber]) {
      cases[entry.docketNumber] = [];
    }
    cases[entry.docketNumber].push(entry);
  }

  const DAYS_THRESHOLD = calculateISODate({
    howMuch: -120,
    units: 'days',
  });

  const coldCases: { docketNumber: string }[] = [];
  for (let docketNumber of Object.keys(cases)) {
    const isCold = cases[docketNumber].every(entry => {
      return entry.filingDate < DAYS_THRESHOLD && !entry.pending;
    });
    if (isCold) {
      coldCases.push({
        docketNumber,
      });
    }
  }

  return coldCases;
};
