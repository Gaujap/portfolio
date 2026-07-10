/**
 * Target registry for the ship guide. Publishers (the project console, later
 * the work pages) declare where the ship should go; the ship subscribes and
 * flies. Every publication bumps `version`, which is the cancellation token:
 * a tour only keeps flying while the version it started under is current, so
 * fast scrolling can never strand the ship on stale targets.
 */

export interface ShipTarget {
  id: string;
  /** Visit order within a tour. The parking spot uses the highest order. */
  order: number;
  /** Live viewport rect — measured at flight time, never cached. */
  getRect: () => DOMRect | null;
  /** Called when the ship arrives / leaves (opens & closes callouts). */
  focus?: () => void;
  blur?: () => void;
  /** Parking spots end the tour: the ship stays until targets change. */
  park?: boolean;
}

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * Each publisher owns a channel and can only retract its own targets — so the
 * console leaving the stage can never wipe the contact section's parking spot
 * (they briefly overlap during fast scrolls). When several channels are live,
 * the highest priority wins.
 */
const channels = new Map<
  string,
  { priority: number; targets: ShipTarget[]; signature: string }
>();

const state = {
  targets: [] as ShipTarget[],
  version: 0,
  /** True while the visitor explores by hand — the ship yields. */
  userBusy: false,
};

function recompute() {
  let winner: { priority: number; targets: ShipTarget[] } | null = null;
  for (const channel of channels.values()) {
    if (channel.targets.length === 0) continue;
    if (!winner || channel.priority > winner.priority) winner = channel;
  }
  state.targets = winner ? winner.targets : [];
  state.version++;
  for (const listener of listeners) listener();
}

export const ship = {
  read(): Readonly<typeof state> {
    return state;
  },

  publish(key: string, targets: ShipTarget[], priority = 0) {
    const sorted = [...targets].sort((a, b) => a.order - b.order);
    // Idempotent: re-publishing the same tour (same ids, same order) must NOT
    // bump the version — observers often re-fire without anything changing,
    // and a version bump would make the ship restart its tour forever.
    const signature = sorted.map((t) => `${t.id}${t.park ? "!" : ""}`).join("|");
    const existing = channels.get(key);
    if (existing && existing.signature === signature && existing.priority === priority) {
      existing.targets = sorted; // refresh closures, keep the version
      return;
    }
    channels.set(key, { priority, targets: sorted, signature });
    recompute();
  },

  retract(key: string) {
    if (channels.delete(key)) recompute();
  },

  setUserBusy(busy: boolean) {
    if (state.userBusy === busy) return;
    state.userBusy = busy;
    state.version++;
    for (const listener of listeners) listener();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
