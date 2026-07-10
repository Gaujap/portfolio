/**
 * Parses the emphasis markers used by the immersive-home copy in
 * `content/home.ts`. Pure string work — safe in server and client components.
 *
 *   `[[word]]`          → emphasized (accent colour)
 *   `[[label->path]]`   → emphasized AND a door: renders as a link to
 *                         `/{locale}/{path}` (the locale prefix is added by
 *                         the component via its `linkBase`).
 */

export interface EmphasisSegment {
  text: string;
  emphasized: boolean;
  /** Locale-less destination path, e.g. "work/hermes" or "ai". */
  target?: string;
}

export function parseEmphasis(input: string): EmphasisSegment[] {
  return input
    .split(/\[\[|\]\]/)
    .map((chunk, i) => {
      if (i % 2 === 0) return { text: chunk, emphasized: false };
      const [text, target] = chunk.split("->");
      return { text: text.trim(), emphasized: true, target: target?.trim() };
    })
    .filter((segment) => segment.text.length > 0);
}

export interface EmphasisWord {
  word: string;
  emphasized: boolean;
  target?: string;
}

/**
 * Flattens segments into animatable tokens. Plain segments split word by
 * word; a linked segment stays whole so the door is one continuous link.
 */
export function toWords(segments: EmphasisSegment[]): EmphasisWord[] {
  const words = segments.flatMap((segment): EmphasisWord[] => {
    if (segment.target) {
      return [
        {
          word: segment.text,
          emphasized: segment.emphasized,
          target: segment.target,
        },
      ];
    }
    return segment.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, emphasized: segment.emphasized }));
  });

  // A "[[word]]," split leaves bare punctuation as its own token; glue it to
  // the previous word so a comma can never wrap to the start of a line.
  return words.reduce<EmphasisWord[]>((merged, entry) => {
    const previous = merged[merged.length - 1];
    if (previous && !entry.target && /^[,.;:!?…)»]+/.test(entry.word)) {
      const [, punctuation, rest] = entry.word.match(/^([,.;:!?…)»]+)(.*)$/)!;
      previous.word += punctuation;
      if (rest) merged.push({ word: rest, emphasized: entry.emphasized });
    } else {
      merged.push({ ...entry });
    }
    return merged;
  }, []);
}
