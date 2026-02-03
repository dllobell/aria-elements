export const Focus = {
  First: 1,
  Previous: 2,
  Next: 4,
  Last: 8,
} as const;

export type Focus = (typeof Focus)[keyof typeof Focus];

export const FocusResult = {
  Success: 1,
  Error: 2,
  Overflow: 4,
  Underflow: 8,
} as const;

export type FocusResult = (typeof FocusResult)[keyof typeof FocusResult];

const Direction = {
  Previous: -1,
  Next: 1,
} as const;

interface FocusInOptions {
  wrap?: boolean;
  relativeTo?: HTMLElement;
}

export function focusIn(elements: HTMLElement[], focus: Focus, options: FocusInOptions): FocusResult {
  const relativeTo = options.relativeTo ?? (document.activeElement as HTMLElement | null);

  if (relativeTo === null) {
    return FocusResult.Error;
  }

  const startIndex = (() => {
    if (focus & Focus.First) return 0;
    if (focus & Focus.Previous) return Math.max(0, elements.indexOf(relativeTo)) - 1;
    if (focus & Focus.Next) return Math.max(0, elements.indexOf(relativeTo)) + 1;
    if (focus & Focus.Last) return elements.length - 1;

    throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last');
  })();

  const direction = focus & (Focus.First | Focus.Next) ? Direction.Next : Direction.Previous;

  let offset = 0;
  let next: HTMLElement | null = null;
  do {
    let index = startIndex + offset;

    if (options.wrap) {
      index = (index + elements.length) % elements.length;
    }

    next = elements[index];

    next?.focus();

    offset += direction;
  } while (next !== document.activeElement);

  return FocusResult.Success;
}
