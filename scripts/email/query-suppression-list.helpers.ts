import {
  GetSuppressedDestinationCommand,
  paginateListSuppressedDestinations,
  SESv2Client,
  type SuppressedDestination,
  type SuppressedDestinationSummary,
} from '@aws-sdk/client-sesv2';
import { generateCsv } from '../helpers/generate-csv';

export type SuppressionListEntry = {
  emailAddress: string;
  lastUpdated: string;
  reason: string;
};

type QuerySuppressionListOptions = {
  emailAddress: string;
  exportResults: boolean;
  region: string;
  sesClient?: SESv2Client;
};

const CSV_COLUMNS = [
  { header: 'Email Address', key: 'emailAddress' },
  { header: 'Reason', key: 'reason' },
  { header: 'Last Updated', key: 'lastUpdated' },
];

const isFullEmailAddress = (emailAddress: string): boolean =>
  !emailAddress.includes('*') &&
  !emailAddress.includes('?') &&
  /^[^\s@]+@[^\s@]+$/.test(emailAddress);

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createEmailMatcher = (
  searchTerm: string,
): ((emailAddress: string) => boolean) => {
  if (searchTerm.includes('*') || searchTerm.includes('?')) {
    const pattern = escapeRegex(searchTerm)
      .replace(/\\\*/g, '.*')
      .replace(/\\\?/g, '.');
    const wildcardRegex = new RegExp(`^${pattern}$`, 'i');
    return emailAddress => wildcardRegex.test(emailAddress);
  }

  const normalizedSearchTerm = searchTerm.toLowerCase();
  return emailAddress =>
    emailAddress.toLowerCase().includes(normalizedSearchTerm);
};

const toSuppressionListEntry = (
  entry: SuppressedDestination | SuppressedDestinationSummary,
): SuppressionListEntry => ({
  emailAddress: entry.EmailAddress ?? '',
  lastUpdated: entry.LastUpdateTime?.toISOString() ?? '',
  reason: entry.Reason ?? '',
});

export const isNotFoundException = (error: unknown): boolean =>
  error instanceof Error && error.name === 'NotFoundException';

const getExactSuppressedDestination = async ({
  emailAddress,
  sesClient,
}: {
  emailAddress: string;
  sesClient: SESv2Client;
}): Promise<SuppressionListEntry[]> => {
  try {
    const response = await sesClient.send(
      new GetSuppressedDestinationCommand({
        EmailAddress: emailAddress,
      }),
    );

    if (!response.SuppressedDestination) {
      return [];
    }

    return [toSuppressionListEntry(response.SuppressedDestination)];
  } catch (error: unknown) {
    if (isNotFoundException(error)) {
      return [];
    }

    throw error;
  }
};

const getAllSuppressedDestinations = async ({
  sesClient,
}: {
  sesClient: SESv2Client;
}): Promise<SuppressionListEntry[]> => {
  const suppressedDestinations: SuppressionListEntry[] = [];
  const pages = paginateListSuppressedDestinations({ client: sesClient }, {});

  for await (const page of pages) {
    const summaries = page.SuppressedDestinationSummaries ?? [];
    suppressedDestinations.push(...summaries.map(toSuppressionListEntry));
  }

  return suppressedDestinations;
};

const getExportFilename = (searchTerm: string): string => {
  const safeSearchTerm = searchTerm.replace(/[^a-z0-9.-]+/gi, '-');
  return `${process.env.HOME}/Documents/suppression-list-${safeSearchTerm}.csv`;
};

const outputResults = ({
  emailAddress,
  exportResults,
  results,
}: {
  emailAddress: string;
  exportResults: boolean;
  results: SuppressionListEntry[];
}): void => {
  if (results.length === 0) {
    console.log(`No suppressed destinations found matching "${emailAddress}".`);
    return;
  }

  console.table(results);

  if (exportResults) {
    const filename = getExportFilename(emailAddress);
    generateCsv({
      columns: CSV_COLUMNS,
      filename,
      rows: results,
    });
    console.log(`Generated ${filename}`);
  }
};

export const querySuppressionList = async ({
  emailAddress,
  exportResults,
  region,
  sesClient,
}: QuerySuppressionListOptions): Promise<SuppressionListEntry[]> => {
  const client = sesClient ?? new SESv2Client({ region });
  let results: SuppressionListEntry[];

  if (isFullEmailAddress(emailAddress)) {
    results = await getExactSuppressedDestination({
      emailAddress,
      sesClient: client,
    });
  } else {
    const matcher = createEmailMatcher(emailAddress);
    const allSuppressedDestinations = await getAllSuppressedDestinations({
      sesClient: client,
    });
    results = allSuppressedDestinations.filter(entry =>
      matcher(entry.emailAddress),
    );
  }

  outputResults({ emailAddress, exportResults, results });
  return results;
};
