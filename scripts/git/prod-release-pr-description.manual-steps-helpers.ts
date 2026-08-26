export type ManualStep = {
  command: string;
  description: string;
  section?: ManualStepSection;
};

export type ManualStepSection = 'after' | 'before';

const BASH_CODE_BLOCK_PATTERN = /```bash\s*\n([\s\S]*?)```/gi;
const BASH_CODE_BLOCK_OPENING_PATTERN = /^```bash\s*$/i;
const LIST_ITEM_PREFIX_PATTERN = /^\s*-\s*(?:\[[ xX]\]\s*)?/;
const HEADING_PATTERN = /^\s*(#{1,6})\s+(.+?)\s*#*\s*$/;
const MANUAL_DEPLOYMENT_HEADING_PATTERN = /^manual deployment steps?:?$/i;
const DEPLOYMENT_SECTION_HEADING_PATTERN = /^(before|after)\s+deployment:?$/i;

const normalizeLineEndings = (value: string): string => {
  return value.replace(/\r\n/g, '\n');
};

const normalizeWhitespace = (value: string): string => {
  return normalizeLineEndings(value).trim();
};

export const extractBashCodeBlocks = (body: string): string[] => {
  const normalizedBody = normalizeLineEndings(body);
  const codeBlocks: string[] = [];

  for (const match of normalizedBody.matchAll(BASH_CODE_BLOCK_PATTERN)) {
    const codeBlock = normalizeWhitespace(match[1]);

    if (codeBlock) {
      codeBlocks.push(codeBlock);
    }
  }

  return codeBlocks;
};

type BashCodeBlock = {
  closingFenceIndex: number;
  command: string;
  openingFenceIndex: number;
};

type MarkdownHeading = {
  level: number;
  text: string;
};

type ManualStepContext = {
  manualDeploymentHeadingLevel?: number;
  manualStep: ManualStep;
  sectionHeadingLevel?: number;
  stepEndIndex: number;
};

const isScopedManualStepContext = (
  context: ManualStepContext | undefined,
): context is ManualStepContext =>
  context?.manualDeploymentHeadingLevel !== undefined ||
  context?.sectionHeadingLevel !== undefined;

const parseHeading = (line: string): MarkdownHeading | undefined => {
  const match = line.match(HEADING_PATTERN);

  if (!match) {
    return undefined;
  }

  return { level: match[1].length, text: match[2].trim() };
};

const isManualDeploymentHeading = (heading: MarkdownHeading): boolean =>
  MANUAL_DEPLOYMENT_HEADING_PATTERN.test(heading.text);

const resolveManualStepSection = (
  heading: MarkdownHeading,
): ManualStepSection | undefined => {
  const match = heading.text.match(DEPLOYMENT_SECTION_HEADING_PATTERN);

  if (match?.[1].toLowerCase() === 'before') {
    return 'before';
  }

  if (match?.[1].toLowerCase() === 'after') {
    return 'after';
  }

  return undefined;
};

const extractBashCodeBlocksWithPositions = (body: string): BashCodeBlock[] => {
  const lines = normalizeLineEndings(body).split('\n');
  const codeBlocks: BashCodeBlock[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!BASH_CODE_BLOCK_OPENING_PATTERN.test(lines[index].trim())) {
      continue;
    }

    const openingFenceIndex = index;
    const commandLines: string[] = [];
    let closingFenceIndex: number | undefined;

    for (
      let commandIndex = index + 1;
      commandIndex < lines.length;
      commandIndex += 1
    ) {
      if (lines[commandIndex].trim() === '```') {
        closingFenceIndex = commandIndex;
        break;
      }

      commandLines.push(lines[commandIndex]);
    }

    if (closingFenceIndex === undefined) {
      break;
    }

    const command = normalizeWhitespace(commandLines.join('\n'));

    codeBlocks.push({
      closingFenceIndex,
      command,
      openingFenceIndex,
    });

    index = closingFenceIndex;
  }

  return codeBlocks;
};

const trimBlankLines = (lines: string[]): string[] => {
  let firstNonBlankLine = 0;

  while (
    firstNonBlankLine < lines.length &&
    lines[firstNonBlankLine].trim().length === 0
  ) {
    firstNonBlankLine += 1;
  }

  let lastNonBlankLine = lines.length;

  while (
    lastNonBlankLine > firstNonBlankLine &&
    lines[lastNonBlankLine - 1].trim().length === 0
  ) {
    lastNonBlankLine -= 1;
  }

  return lines.slice(firstNonBlankLine, lastNonBlankLine);
};

const normalizeManualStepDescription = (lines: string[]): string => {
  const descriptionLines = trimBlankLines(
    lines.filter(line => {
      const heading = parseHeading(line);

      return (
        !heading ||
        (!isManualDeploymentHeading(heading) &&
          resolveManualStepSection(heading) === undefined)
      );
    }),
  );

  if (descriptionLines.length === 0) {
    return 'Manual step';
  }

  const normalizedDescriptionLines = descriptionLines.map((line, index) => {
    const lineWithoutListPrefix = line.replace(LIST_ITEM_PREFIX_PATTERN, '');
    const heading = parseHeading(lineWithoutListPrefix);

    if (index === 0 && heading) {
      return heading.text;
    }

    return lineWithoutListPrefix;
  });
  const description = normalizeWhitespace(
    normalizedDescriptionLines.join('\n'),
  );

  return description || 'Manual step';
};

const appendTrailingDescription = (
  manualStepContext: ManualStepContext,
  lines: string[],
  endIndex: number = lines.length,
): void => {
  if (!isScopedManualStepContext(manualStepContext)) {
    return;
  }

  const trailingDescription = normalizeManualStepDescription(
    lines.slice(manualStepContext.stepEndIndex + 1, endIndex),
  );

  if (trailingDescription === 'Manual step') {
    return;
  }

  manualStepContext.manualStep.description =
    manualStepContext.manualStep.description === 'Manual step'
      ? trailingDescription
      : `${manualStepContext.manualStep.description}\n\n${trailingDescription}`;
};

export const extractManualSteps = (body: string): ManualStep[] => {
  const normalizedBody = normalizeLineEndings(body);
  const lines = normalizedBody.split('\n');
  const bashCodeBlocks = extractBashCodeBlocksWithPositions(normalizedBody);
  const hasManualDeploymentSection = lines.some(line => {
    const heading = parseHeading(line);

    return heading ? isManualDeploymentHeading(heading) : false;
  });
  const manualSteps: ManualStep[] = [];
  let bashCodeBlockIndex = 0;
  let currentManualDeploymentHeadingLevel: number | undefined;
  let currentSection: ManualStepSection | undefined;
  let currentSectionHeadingLevel: number | undefined;
  let previousBlockEndIndex = 0;
  let lastManualStepContext: ManualStepContext | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const heading = parseHeading(lines[index]);

    if (heading) {
      if (isScopedManualStepContext(lastManualStepContext)) {
        appendTrailingDescription(lastManualStepContext, lines, index);
        lastManualStepContext = undefined;
      }

      if (isManualDeploymentHeading(heading)) {
        currentManualDeploymentHeadingLevel = heading.level;
        currentSection = undefined;
        currentSectionHeadingLevel = undefined;
        previousBlockEndIndex = index + 1;
      } else {
        const section = resolveManualStepSection(heading);
        const isWithinManualDeploymentSection =
          currentManualDeploymentHeadingLevel !== undefined &&
          heading.level > currentManualDeploymentHeadingLevel;

        if (
          section &&
          (!hasManualDeploymentSection || isWithinManualDeploymentSection)
        ) {
          currentSection = section;
          currentSectionHeadingLevel = heading.level;
          previousBlockEndIndex = index + 1;
        } else if (
          currentManualDeploymentHeadingLevel !== undefined &&
          heading.level <= currentManualDeploymentHeadingLevel
        ) {
          currentManualDeploymentHeadingLevel = undefined;
          currentSection = undefined;
          currentSectionHeadingLevel = undefined;
          previousBlockEndIndex = index + 1;
        } else if (
          currentSectionHeadingLevel !== undefined &&
          heading.level <= currentSectionHeadingLevel
        ) {
          currentSection = undefined;
          currentSectionHeadingLevel = undefined;
          previousBlockEndIndex = index;
        }
      }
    }

    const bashCodeBlock = bashCodeBlocks[bashCodeBlockIndex];

    if (!bashCodeBlock || bashCodeBlock.openingFenceIndex !== index) {
      continue;
    }

    bashCodeBlockIndex += 1;
    const descriptionStartIndex = previousBlockEndIndex;
    index = bashCodeBlock.closingFenceIndex;
    previousBlockEndIndex = index + 1;

    if (
      !bashCodeBlock.command ||
      (hasManualDeploymentSection &&
        currentManualDeploymentHeadingLevel === undefined)
    ) {
      continue;
    }

    const description = normalizeManualStepDescription(
      lines.slice(descriptionStartIndex, bashCodeBlock.openingFenceIndex),
    );

    manualSteps.push({
      command: bashCodeBlock.command,
      description,
      ...(currentSection ? { section: currentSection } : {}),
    });
    lastManualStepContext = {
      manualDeploymentHeadingLevel: currentManualDeploymentHeadingLevel,
      manualStep: manualSteps[manualSteps.length - 1],
      sectionHeadingLevel: currentSectionHeadingLevel,
      stepEndIndex: bashCodeBlock.closingFenceIndex,
    };
  }

  if (lastManualStepContext) {
    appendTrailingDescription(lastManualStepContext, lines);
  }

  return manualSteps;
};

export const dedupeManualSteps = (manualSteps: ManualStep[]): ManualStep[] => {
  const uniqueSteps = new Map<string, ManualStep>();

  for (const manualStep of manualSteps) {
    const uniqueStepKey = `${manualStep.section ?? 'unsectioned'}:${manualStep.command}`;
    const existingManualStep = uniqueSteps.get(uniqueStepKey);

    if (!existingManualStep) {
      uniqueSteps.set(uniqueStepKey, manualStep);
      continue;
    }

    if (
      existingManualStep.description === 'Manual step' &&
      manualStep.description !== 'Manual step'
    ) {
      uniqueSteps.set(uniqueStepKey, manualStep);
    }
  }

  return Array.from(uniqueSteps.values());
};

const renderManualStep = (manualStep: ManualStep): string[] => {
  const descriptionLines = manualStep.description.split('\n');

  return [
    `- [ ] ${descriptionLines[0]}`,
    ...descriptionLines.slice(1).map(line => `   ${line}`),
    '   ```bash',
    `   ${manualStep.command.replace(/\n/g, '\n   ')}`,
    '   ```',
  ];
};

const appendManualSteps = (
  lines: string[],
  manualSteps: ManualStep[],
): void => {
  manualSteps.forEach((manualStep, index) => {
    lines.push(...renderManualStep(manualStep));

    if (index < manualSteps.length - 1) {
      lines.push('');
    }
  });
};

export const renderManualSteps = (manualSteps: ManualStep[]): string[] => {
  const lines: string[] = [];
  const unsectionedManualSteps = manualSteps.filter(
    manualStep => manualStep.section === undefined,
  );

  appendManualSteps(lines, unsectionedManualSteps);

  for (const section of ['before', 'after'] as const) {
    const sectionManualSteps = manualSteps.filter(
      manualStep => manualStep.section === section,
    );

    if (sectionManualSteps.length === 0) {
      continue;
    }

    if (lines.length > 0) {
      lines.push('');
    }

    lines.push(
      `#### ${section === 'before' ? 'Before Deployment' : 'After Deployment'}`,
      '',
    );
    appendManualSteps(lines, sectionManualSteps);
  }

  return lines;
};
