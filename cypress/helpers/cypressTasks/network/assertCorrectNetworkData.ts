import { CapturedNetworkPayload } from '../../../local-only/support/commands';

export type SensitiveFinding = {
  url: string;
  method: string;
  location: string;
  patternName: string;
  matchPreview: string;
};

export type SensitiveNetworkScanResult = {
  passed: boolean;
  findings: SensitiveFinding[];
};

const SENSITIVE_PATTERNS: Array<{
  name: string;
  regex: RegExp;
}> = [
  {
    name: 'SSN-like value',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  {
    name: 'Email address',
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    name: 'access key',
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: 'Secret-like key',
    regex:
      /["']?(apiKey|api_key|accessToken|access_token|refreshToken|refresh_token|secret|password|token)["']?\s*[:=]\s*["'][^"']{8,}["']/gi,
  },
];

const ALLOWLIST: Array<{
  url?: RegExp;
  patternName?: string;
  location?: string;
}> = [
  // {
  //   url:
  //   patternName: "Email address",
  // },
];

function safeStringify(value: unknown): string {
  if (value == null) return '';

  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function redactPreview(match: string): string {
  if (match.length <= 8) return '[redacted]';
  return `${match.slice(0, 4)}...[redacted]...${match.slice(-4)}`;
}

function isAllowed(finding: SensitiveFinding): boolean {
  return ALLOWLIST.some(rule => {
    const urlMatches = rule.url ? rule.url.test(finding.url) : true;
    const patternMatches = rule.patternName
      ? rule.patternName === finding.patternName
      : true;
    const locationMatches = rule.location
      ? rule.location === finding.location
      : true;

    return urlMatches && patternMatches && locationMatches;
  });
}

function scanText(args: {
  text: string;
  url: string;
  method: string;
  location: string;
}): SensitiveFinding[] {
  const findings: SensitiveFinding[] = [];

  for (const pattern of SENSITIVE_PATTERNS) {
    const matches = args.text.matchAll(pattern.regex);

    for (const match of matches) {
      const finding: SensitiveFinding = {
        url: args.url,
        method: args.method,
        location: args.location,
        patternName: pattern.name,
        matchPreview: redactPreview(match[0]),
      };

      if (!isAllowed(finding)) {
        findings.push(finding);
      }
    }
  }

  return findings;
}

export function assertCorrectNetworkData(
  payloads: CapturedNetworkPayload[],
): SensitiveNetworkScanResult {
  const findings = payloads.flatMap(payload => {
    const scanTargets = [
      {
        location: 'url',
        text: payload.url,
      },
      {
        location: 'requestBody',
        text: safeStringify(payload.requestBody),
      },
      {
        location: 'responseBody',
        text: safeStringify(payload.responseBody),
      },
      {
        location: 'requestHeaders',
        text: safeStringify(payload.requestHeaders),
      },
      {
        location: 'responseHeaders',
        text: safeStringify(payload.responseHeaders),
      },
    ];

    return scanTargets.flatMap(target =>
      scanText({
        text: target.text,
        url: payload.url,
        method: payload.method,
        location: target.location,
      }),
    );
  });

  return {
    passed: findings.length === 0,
    findings,
  };
}
