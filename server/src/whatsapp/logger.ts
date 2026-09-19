type LogLevel = "info" | "warn" | "error";

const LEVEL_WEIGHT: Record<LogLevel, number> = { info: 0, warn: 1, error: 2 };

// Default "info" (semua level tampil). Diatur eksplisit dari index.ts saat
// startup lewat setLogLevel(env.logLevel) - modul ini sendiri tidak baca
// process.env langsung supaya tetap gampang diuji/tidak ada side effect
// tersembunyi saat di-import.
let minLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel): void {
  minLevel = level;
}

function timestamp(): string {
  return new Date().toISOString();
}

function write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[minLevel]) return;

  const prefix = `[${timestamp()}] [${level.toUpperCase()}]`;
  if (meta !== undefined) {
    console.log(prefix, message, meta);
  } else {
    console.log(prefix, message);
  }
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>): void {
    write("info", message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>): void {
    write("warn", message, meta);
  },
  error(message: string, meta?: Record<string, unknown>): void {
    write("error", message, meta);
  },
};

/**
 * Ubah `unknown` dari catch-block jadi string yang selalu informatif untuk
 * log. `error instanceof Error ? error.message : String(error)` (pola lama
 * di codebase ini) menghasilkan output buruk untuk exception non-Error -
 * mis. Puppeteer/whatsapp-web.js kadang melempar string pendek atau object
 * biasa, dan `String(error)` pada string pendek literal ("r") atau object
 * ("[object Object]") tidak memberi info yang berguna untuk debug.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) return error.stack ?? error.message;
  if (typeof error === "string") return `(non-Error string thrown) "${error}"`;
  try {
    return `(non-Error value thrown) ${JSON.stringify(error)}`;
  } catch {
    return `(non-Error value thrown, tidak bisa di-JSON.stringify) ${String(error)}`;
  }
}
