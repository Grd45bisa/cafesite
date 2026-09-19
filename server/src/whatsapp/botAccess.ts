export type BotDecision =
  | { kind: "ignore" }
  | { kind: "enabled" | "disabled" }
  | { kind: "message"; text: string; token: object };
interface Conversation { active: boolean; expiresAt: number; token: object; }
export const BOT_IDLE_MS = 5 * 60_000;
const DEDUP_MS = 60 * 60_000;

/** In-memory state for one bot process. Commands are handled before any await. */
export class BotAccess {
  private readonly conversations = new Map<string, Conversation>();
  private readonly seen = new Map<string, number>();
  constructor(private readonly onClose: (from: string) => void = () => undefined) {}

  accept(from: string, id: string, body: string, now = Date.now()): BotDecision {
    if (!id) return { kind: "ignore" };
    const key = `${from}:${id}`;
    if ((this.seen.get(key) ?? 0) > now) return { kind: "ignore" };
    this.seen.set(key, now + DEDUP_MS);
    let session = this.conversations.get(from);
    if (session && session.expiresAt <= now) {
      this.conversations.delete(from); this.onClose(from); session = undefined;
    }
    const text = body.trim();
    if (/^@tutup$/i.test(text)) {
      this.conversations.delete(from); this.onClose(from);
      return { kind: "disabled" };
    }
    if (/^@bot$/i.test(text)) {
      this.conversations.set(from, { active: true, expiresAt: now + BOT_IDLE_MS, token: session?.token ?? {} });
      return { kind: "enabled" };
    }
    const prefix = /^@bot\s+/i.test(text);
    if (!session?.active && !prefix) return { kind: "ignore" };
    const current = session ?? { active: false, expiresAt: now + BOT_IDLE_MS, token: {} };
    current.expiresAt = now + BOT_IDLE_MS;
    this.conversations.set(from, current);
    const content = prefix ? text.replace(/^@bot\s+/i, "").trim() : text;
    return content ? { kind: "message", text: content, token: current.token } : { kind: "ignore" };
  }

  canReply(from: string, token: object, now = Date.now()): boolean {
    const session = this.conversations.get(from);
    return session?.token === token && session.expiresAt > now;
  }

  prune(now = Date.now()): void {
    for (const [key, expiry] of this.seen) if (expiry <= now) this.seen.delete(key);
    for (const [from, session] of this.conversations) {
      if (session.expiresAt <= now) { this.conversations.delete(from); this.onClose(from); }
    }
  }
}
