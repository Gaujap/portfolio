/**
 * Parses `[[emphasis]]` markers used by the immersive-home copy in
 * `content/home.ts`. Pure string work — safe in server and client components.
 */

export interface EmphasisSegment {
  text: string;
  emphasized: boolean;
}

export function parseEmphasis(input: string): EmphasisSegment[] {
  return input
    .split(/\[\[|\]\]/)
    .map((text, i) => ({ text, emphasized: i % 2 === 1 }))
    .filter((segment) => segment.text.length > 0);
}

export interface EmphasisWord {
  word: string;
  emphasized: boolean;
}

/** Flattens segments into words so kinetic text can animate word by word. */
export function toWords(segments: EmphasisSegment[]): EmphasisWord[] {
  const words = segments.flatMap((segment) =>
    segment.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, emphasized: segment.emphasized })),
  );

  // A "[[word]]," split leaves bare punctuation as its own token; glue it to
  // the previous word so a comma can never wrap to the start of a line.
  return words.reduce<EmphasisWord[]>((merged, entry) => {
    const previous = merged[merged.length - 1];
    if (previous && /^[,.;:!?…)»]+/.test(entry.word)) {
      const [, punctuation, rest] = entry.word.match(/^([,.;:!?…)»]+)(.*)$/)!;
      previous.word += punctuation;
      if (rest) merged.push({ word: rest, emphasized: entry.emphasized });
    } else {
      merged.push({ ...entry });
    }
    return merged;
  }, []);
}
