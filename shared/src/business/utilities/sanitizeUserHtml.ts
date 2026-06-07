import { isTag } from 'domhandler';
import { parseDocument } from 'htmlparser2';
import { render as renderHtml } from 'dom-serializer';

// Tags Quill is configured to produce for court-issued orders (see
// web-client/src/views/CreateOrder/TextEditor.tsx — formats: size, bold,
// italic, underline, bullet, list, indent). Anything else is dropped before
// the HTML reaches the headless Chromium PDF renderer.
const ALLOWED_ELEMENTS: ReadonlySet<string> = new Set([
  'p',
  'span',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'br',
]);

const ALLOWED_STYLE_PROPERTIES: ReadonlySet<string> = new Set([
  'font-size',
  'padding-left',
  'white-space',
]);

const QL_INDENT_CLASS = /^ql-indent-\d+$/;

const ALLOWED_CLASSES: ReadonlySet<string> = new Set(['indent-paragraph']);

const isAllowedClass = (token: string): boolean =>
  QL_INDENT_CLASS.test(token) || ALLOWED_CLASSES.has(token);

const DANGEROUS_STYLE_PATTERN = /expression\s*\(|url\s*\(|javascript\s*:/i;

type DomNode = ReturnType<typeof parseDocument>['children'][number];

const sanitizeClassAttr = (value: string): string | undefined => {
  const kept = value
    .split(/\s+/)
    .filter(token => token.length > 0 && isAllowedClass(token));
  return kept.length > 0 ? kept.join(' ') : undefined;
};

const sanitizeStyleAttr = (value: string): string | undefined => {
  const kept: string[] = [];
  for (const decl of value.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim().toLowerCase();
    const propValue = decl.slice(idx + 1).trim();
    if (!ALLOWED_STYLE_PROPERTIES.has(prop)) continue;
    if (DANGEROUS_STYLE_PATTERN.test(propValue)) continue;
    kept.push(`${prop}: ${propValue}`);
  }
  return kept.length > 0 ? kept.join('; ') : undefined;
};

const scrubAttributes = (attribs: Record<string, string>): void => {
  for (const name of Object.keys(attribs)) {
    const lower = name.toLowerCase();
    if (lower === 'class') {
      const next = sanitizeClassAttr(attribs[name]);
      if (next) attribs[name] = next;
      else delete attribs[name];
      continue;
    }
    if (lower === 'style') {
      const next = sanitizeStyleAttr(attribs[name]);
      if (next) attribs[name] = next;
      else delete attribs[name];
      continue;
    }
    delete attribs[name];
  }
};

const walk = (nodes: DomNode[]): DomNode[] => {
  const out: DomNode[] = [];
  for (const node of nodes) {
    if (!isTag(node)) {
      out.push(node);
      continue;
    }
    const tag = node.name.toLowerCase();
    if (!ALLOWED_ELEMENTS.has(tag)) {
      // Drop disallowed elements and their subtrees entirely. We deliberately
      // do not "unwrap" children — Quill-produced HTML never relies on this,
      // and unwrapping a <script> would surface its text content in the PDF.
      continue;
    }
    if (node.attribs) scrubAttributes(node.attribs);
    if (node.children && node.children.length > 0) {
      node.children = walk(node.children as DomNode[]);
    }
    out.push(node);
  }
  return out;
};

/**
 * Strips any markup outside the Quill-produced allowlist from user-supplied
 * order HTML before it is rendered to PDF by headless Chromium. This is a
 * defense-in-depth layer on top of page.setJavaScriptEnabled(false) in
 * generatePdfFromHtmlHelper.ts — both fire even if one is later regressed.
 */
export const sanitizeUserHtml = (html: string): string => {
  if (!html) return '';
  const dom = parseDocument(html);
  dom.children = walk(dom.children as DomNode[]);
  return renderHtml(dom);
};
