import { execFileSync } from 'child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';

type CoverageMetricName = 'branches' | 'functions' | 'lines' | 'statements';

type IstanbulCoverageMetric = {
  pct: number;
};

type IstanbulCoverageSummary = {
  total: Record<CoverageMetricName, IstanbulCoverageMetric>;
};

type GitHubPullRequestResponse = {
  body: string;
};

type WorkflowArtifact = {
  archive_download_url: string;
  expired: boolean;
  name: string;
  workflow_run?: {
    head_sha?: string;
  };
};

type WorkflowArtifactsResponse = {
  artifacts: WorkflowArtifact[];
};

export const COVERAGE_HEADING = '### Coverage';
export const COVERAGE_PENDING_CELL = 'Pending';
export const COVERAGE_TABLE_DIVIDER = '| --- | --- | --- |';
export const COVERAGE_TABLE_HEADER = '| Suite | Before | After |';
export const COVERAGE_UNAVAILABLE_CELL = 'Not available';
export const COVERAGE_SUITES = ['api', 'client', 'scripts', 'shared'] as const;

export type CoverageSuite = (typeof COVERAGE_SUITES)[number];

export type CoverageSummary = {
  branches: number;
  functions: number;
  lines: number;
  statements: number;
  suite: CoverageSuite;
};

const COVERAGE_METRICS: CoverageMetricName[] = [
  'branches',
  'functions',
  'lines',
  'statements',
];

const getGitHubHeaders = (token: string): Record<string, string> => {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'ef-cms-suite-coverage',
    'X-GitHub-Api-Version': '2022-11-28',
  };
};

export const formatCoveragePercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatCoverageCell = (summary?: CoverageSummary): string => {
  if (!summary) {
    return COVERAGE_UNAVAILABLE_CELL;
  }

  return COVERAGE_METRICS.map(
    metric => `${metric}: ${formatCoveragePercent(summary[metric])}`,
  ).join('<br />');
};

export const getCoverageSummaryArtifactName = ({
  pullRequestNumber,
  suite,
}: {
  pullRequestNumber: number;
  suite: CoverageSuite;
}): string => {
  return `coverage-summary-${suite}-pr-${pullRequestNumber}`;
};

export const renderCoverageRow = ({
  after,
  before,
  suite,
}: {
  after?: CoverageSummary;
  before?: CoverageSummary;
  suite: CoverageSuite;
}): string => {
  return `| ${suite} | ${formatCoverageCell(before)} | ${after ? formatCoverageCell(after) : COVERAGE_PENDING_CELL} |`;
};

export const renderCoverageSection = ({
  afterBySuite = {},
  beforeBySuite = {},
}: {
  afterBySuite?: Partial<Record<CoverageSuite, CoverageSummary>>;
  beforeBySuite?: Partial<Record<CoverageSuite, CoverageSummary>>;
}): string[] => {
  const lines: string[] = [
    COVERAGE_HEADING,
    '',
    COVERAGE_TABLE_HEADER,
    COVERAGE_TABLE_DIVIDER,
  ];

  for (const suite of COVERAGE_SUITES) {
    lines.push(
      renderCoverageRow({
        after: afterBySuite[suite],
        before: beforeBySuite[suite],
        suite,
      }),
    );
  }

  return lines;
};

export const readCoverageSummary = (filePath: string): CoverageSummary => {
  return JSON.parse(readFileSync(filePath, 'utf8')) as CoverageSummary;
};

export const summarizeCoverageReport = ({
  report,
  suite,
}: {
  report: IstanbulCoverageSummary;
  suite: CoverageSuite;
}): CoverageSummary => {
  return {
    branches: report.total.branches.pct,
    functions: report.total.functions.pct,
    lines: report.total.lines.pct,
    statements: report.total.statements.pct,
    suite,
  };
};

export const writeCoverageSummary = ({
  inputFilePath,
  outputFilePath,
  suite,
}: {
  inputFilePath: string;
  outputFilePath: string;
  suite: CoverageSuite;
}): CoverageSummary => {
  const report = JSON.parse(
    readFileSync(inputFilePath, 'utf8'),
  ) as IstanbulCoverageSummary;
  const summary = summarizeCoverageReport({ report, suite });

  writeFileSync(outputFilePath, JSON.stringify(summary, null, 2));

  return summary;
};

export const replaceCoverageTableRow = ({
  body,
  summary,
}: {
  body: string;
  summary: CoverageSummary;
}): string => {
  const suiteRowPattern = new RegExp(
    `^\\| ${summary.suite} \\| (.+?) \\| (.+?) \\|$`,
    'm',
  );

  if (!body.includes(COVERAGE_HEADING) || !suiteRowPattern.test(body)) {
    return body;
  }

  return body.replace(suiteRowPattern, (_match, beforeCell: string): string => {
    return `| ${summary.suite} | ${beforeCell} | ${formatCoverageCell(summary)} |`;
  });
};

export const replaceCoverageTableRows = ({
  body,
  summaries,
}: {
  body: string;
  summaries: CoverageSummary[];
}): string => {
  return summaries.reduce(
    (updatedBody: string, summary: CoverageSummary): string =>
      replaceCoverageTableRow({ body: updatedBody, summary }),
    body,
  );
};

export const updatePullRequestCoverage = async ({
  fetchImplementation = fetch,
  pullRequestNumber,
  repository,
  summaries,
  summary,
  token,
}: {
  fetchImplementation?: typeof fetch;
  pullRequestNumber: number;
  repository: string;
  summaries?: CoverageSummary[];
  summary?: CoverageSummary;
  token: string;
}): Promise<boolean> => {
  const coverageSummaries = summaries ?? (summary ? [summary] : []);

  if (coverageSummaries.length === 0) {
    return false;
  }

  const url = `https://api.github.com/repos/${repository}/pulls/${pullRequestNumber}`;
  const headers = getGitHubHeaders(token);
  const pullRequestResponse = await fetchImplementation(url, {
    headers,
    method: 'GET',
  });

  if (!pullRequestResponse.ok) {
    throw new Error(
      `Unable to read pull request #${pullRequestNumber} (${pullRequestResponse.status})`,
    );
  }

  const pullRequest =
    (await pullRequestResponse.json()) as GitHubPullRequestResponse;
  const updatedBody = replaceCoverageTableRows({
    body: pullRequest.body ?? '',
    summaries: coverageSummaries,
  });

  if (updatedBody === pullRequest.body) {
    return false;
  }

  const updateResponse = await fetchImplementation(url, {
    body: JSON.stringify({ body: updatedBody }),
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });

  if (!updateResponse.ok) {
    throw new Error(
      `Unable to update pull request #${pullRequestNumber} (${updateResponse.status})`,
    );
  }

  return true;
};

export const downloadCoverageSummaryArtifact = async ({
  artifact,
  token,
}: {
  artifact: WorkflowArtifact;
  token: string;
}): Promise<CoverageSummary> => {
  const response = await fetch(artifact.archive_download_url, {
    headers: getGitHubHeaders(token),
  });

  if (!response.ok) {
    throw new Error(
      `Artifact download failed (${response.status}): ${artifact.archive_download_url}`,
    );
  }

  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'suite-coverage'));

  try {
    const archivePath = path.join(tempDir, 'artifact.zip');

    writeFileSync(archivePath, Buffer.from(await response.arrayBuffer()));
    execFileSync('unzip', ['-o', archivePath, '-d', tempDir], {
      stdio: 'ignore',
    });

    const extractedJsonFiles = execFileSync(
      'find',
      [tempDir, '-type', 'f', '-name', '*.json'],
      { encoding: 'utf8' },
    )
      .split('\n')
      .map(fileName => fileName.trim())
      .filter(Boolean);

    if (extractedJsonFiles.length !== 1) {
      throw new Error(
        `Downloaded artifact must contain exactly one json coverage summary file, found ${extractedJsonFiles.length}`,
      );
    }

    return JSON.parse(
      readFileSync(extractedJsonFiles[0], 'utf8'),
    ) as CoverageSummary;
  } finally {
    rmSync(tempDir, { force: true, recursive: true });
  }
};

export const getCoverageSummary = async ({
  headSha,
  pullRequestNumber,
  repository,
  suite,
  token,
}: {
  headSha?: string;
  pullRequestNumber: number;
  repository: string;
  suite: CoverageSuite;
  token: string;
}): Promise<CoverageSummary | undefined> => {
  const artifactName = getCoverageSummaryArtifactName({
    pullRequestNumber,
    suite,
  });
  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/artifacts?name=${artifactName}&per_page=100`,
    {
      headers: getGitHubHeaders(token),
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub artifact lookup failed (${response.status}): ${artifactName}`,
    );
  }

  const artifactsResponse =
    (await response.json()) as WorkflowArtifactsResponse;
  const artifact = artifactsResponse.artifacts.find(
    workflowArtifact =>
      workflowArtifact.name === artifactName &&
      !workflowArtifact.expired &&
      (!headSha || workflowArtifact.workflow_run?.head_sha === headSha),
  );

  if (!artifact) {
    return undefined;
  }

  return await downloadCoverageSummaryArtifact({ artifact, token });
};
