import { cn } from "@/lib/cn";

/** A single technical-identifier chip. */
export function Tag({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A wrapped list of stack tags. */
export function TagList({
  items,
  className,
  label,
}: {
  items: string[];
  className?: string;
  /** Accessible name for the list, e.g. "Stack". */
  label?: string;
}) {
  return (
    <ul
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
