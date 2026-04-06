/**
 * Parses raw theory text from topics.js into structured blocks for rendering.
 *
 * Block types:
 *   heading   – short sub-section title
 *   paragraph – regular text
 *   bullets   – bullet list (lines starting with •)
 *   numbered  – numbered list (lines starting with 1), 2), ...)
 *   callout   – emoji-headed block (✅, ❌, etc.) with optional body
 */
export default function parseTheoryText(rawText) {
  if (!rawText) return [];

  const text = rawText.replace(/\r\n/g, '\n').trim();
  const segments = text.split(/\n{2,}/);
  const blocks = [];

  for (const seg of segments) {
    blocks.push(...parseSegment(seg));
  }

  return blocks;
}

/* ─── Segment parser ─── */

function parseSegment(segment) {
  const lines = segment.split('\n').filter((l) => l.trim());
  if (!lines.length) return [];

  const first = lines[0].trimStart();
  const results = [];

  if (startsWithEmoji(first)) {
    const spaceIdx = first.indexOf(' ');
    const emoji = spaceIdx > 0 ? first.slice(0, spaceIdx) : first;
    const title = spaceIdx > 0 ? first.slice(spaceIdx + 1).trim() : '';
    const bodyLines = lines.slice(1);
    let body = null;
    if (bodyLines.length) {
      body = classifyBodyLines(bodyLines);
    }
    results.push({
      type: 'callout',
      emoji,
      title,
      variant: getCalloutVariant(emoji),
      body,
    });
    return results;
  }

  if (lines.length > 1 && isHeadingLine(first)) {
    results.push({ type: 'heading', content: first.trim() });
    results.push(...parseMixedLines(lines.slice(1)));
    return results;
  }

  if (lines.length === 1 && isHeadingLine(first)) {
    results.push({ type: 'heading', content: first.trim() });
    return results;
  }

  results.push(...parseMixedLines(lines));
  return results;
}

/* ─── Mixed-content line parser ─── */

function parseMixedLines(lines) {
  const results = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trimStart();

    if (trimmed.startsWith('•')) {
      const items = [];
      while (i < lines.length && lines[i].trimStart().startsWith('•')) {
        items.push(lines[i].trimStart().replace(/^•\s*/, '').trim());
        i++;
      }
      results.push({ type: 'bullets', items });
      continue;
    }

    if (/^\d+\)\s/.test(trimmed)) {
      const numLines = [];
      while (i < lines.length) {
        const l = lines[i];
        const lt = l.trimStart();
        if (/^\d+\)\s/.test(lt)) {
          numLines.push(l);
          i++;
        } else if (numLines.length > 0 && /^\s{2,}/.test(l)) {
          numLines.push(l);
          i++;
        } else {
          break;
        }
      }
      results.push({ type: 'numbered', items: parseNumberedItems(numLines) });
      continue;
    }

    const paraLines = [];
    while (i < lines.length) {
      const l = lines[i].trimStart();
      if (l.startsWith('•') || /^\d+\)\s/.test(l)) break;
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length) {
      results.push({ type: 'paragraph', content: paraLines.join('\n') });
    }
  }

  return results;
}

/* ─── Helpers ─── */

function classifyBodyLines(lines) {
  if (lines.every((l) => l.trimStart().startsWith('•'))) {
    return {
      type: 'bullets',
      items: lines.map((l) => l.trimStart().replace(/^•\s*/, '').trim()),
    };
  }
  if (lines.some((l) => /^\s*\d+\)\s/.test(l))) {
    return { type: 'numbered', items: parseNumberedItems(lines) };
  }
  return { type: 'text', content: lines.map((l) => l.trim()).join('\n') };
}

function parseNumberedItems(lines) {
  const items = [];
  let current = null;
  for (const line of lines) {
    const match = line.trimStart().match(/^\d+\)\s*(.*)/);
    if (match) {
      if (current !== null) items.push(current);
      current = match[1].trim();
    } else if (current !== null) {
      current += ' ' + line.trim();
    }
  }
  if (current !== null) items.push(current);
  return items;
}

function isHeadingLine(line) {
  const t = line.trim();
  if (!t || t.length > 60) return false;
  if (t.startsWith('•') || /^\d+\)/.test(t)) return false;
  if (startsWithEmoji(t)) return false;
  const last = t[t.length - 1];
  return !'.։:!?»)'.includes(last);
}

function startsWithEmoji(line) {
  if (!line) return false;
  const cp = line.trimStart().codePointAt(0);
  if (cp === undefined) return false;
  return (
    (cp >= 0x2600 && cp <= 0x27bf) ||
    (cp >= 0x2b50 && cp <= 0x2b55) ||
    (cp >= 0x1f300 && cp <= 0x1ffff)
  );
}

function getCalloutVariant(emoji) {
  if (emoji.includes('✅') || emoji.includes('✔') || emoji.includes('✓'))
    return 'positive';
  if (emoji.includes('❌') || emoji.includes('✗') || emoji.includes('✖'))
    return 'negative';
  if (emoji.includes('⚠') || emoji.includes('⚡')) return 'warning';
  return 'info';
}
