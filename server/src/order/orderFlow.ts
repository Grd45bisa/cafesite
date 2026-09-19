import { getSupabaseConfig, getBotUserId, type BotEnv } from "../config/env";
import { fetchMenu, matchCartText, type MenuEntry } from "./menu";
import { fetchAvailableTables } from "./tables";
import { createCafeOrder, markOrderPaid } from "./orderApi";
import { isCancelIntent } from "./intent";
import { getSession, startSession, touchSession, clearSession, type OrderSession, type CartLine } from "./session";
import { logger, describeError } from "../whatsapp/logger";
import { hashIdentity } from "../whatsapp/privacy";

const GENERIC_ERROR_REPLY = "Sebentar ya, saya lagi gangguan koneksi. Coba lagi.";
const DONE_KEYWORDS = ["selesai", "jadi", "cukup", "lanjut"];
const DINE_IN_KEYWORDS = ["dine in", "dine-in", "makan di tempat", "di tempat"];
const TAKEAWAY_KEYWORDS = ["take away", "takeaway", "bawa pulang"];

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function cartTotal(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

function renderCart(cart: CartLine[]): string {
  return cart.map((line) => `- ${line.quantity}x ${line.name} (${formatRupiah(line.price * line.quantity)})`).join("\n");
}

/**
 * Titik masuk order flow dari index.ts. Menangani intent order baru DAN
 * kelanjutan sesi order yang sedang berjalan untuk `chatId` (message.from).
 * Selalu mengembalikan teks balasan - tidak pernah melempar exception ke
 * pemanggil (semua error ditangkap dan dijawab ramah di dalam sini).
 */
export async function handleOrderMessage(env: BotEnv, chatId: string, text: string): Promise<string> {
  try {
    let session = getSession(chatId);

    if (!session) {
      session = startSession(chatId);
      touchSession(chatId);
      return "Yuk, mau pesan apa hari ini? Sebutkan menu dan jumlahnya, misalnya \"2 americano, 1 nasi goreng\".";
    }

    touchSession(chatId);

    if (isCancelIntent(text)) {
      clearSession(chatId);
      return "Oke, pesanan dibatalkan. Ketik \"pesan\" lagi kapan saja kalau mau mulai ulang.";
    }

    switch (session.step) {
      case "collecting_items":
        return await handleCollectingItems(env, session, text);
      case "awaiting_fulfillment":
        return await handleAwaitingFulfillment(env, session, text);
      case "awaiting_table":
        return await handleAwaitingTable(env, session, text);
      case "awaiting_name":
        return handleAwaitingName(session, text);
      case "awaiting_phone":
        return handleAwaitingPhone(session, text);
      case "awaiting_confirmation":
        return await handleAwaitingConfirmation(env, chatId, session, text);
      default:
        return GENERIC_ERROR_REPLY;
    }
  } catch (error: unknown) {
    logger.error("Order flow gagal karena error tidak terduga.", { identity: hashIdentity(chatId), error: describeError(error) });
    return GENERIC_ERROR_REPLY;
  }
}

async function handleCollectingItems(env: BotEnv, session: OrderSession, text: string): Promise<string> {
  const normalized = normalize(text);
  const wantsToFinish = DONE_KEYWORDS.some((keyword) => normalized === keyword);

  if (wantsToFinish) {
    if (session.cart.length === 0) {
      return "Keranjang masih kosong. Sebutkan dulu menu yang mau dipesan ya.";
    }
    session.step = "awaiting_fulfillment";
    return `Oke, keranjang saat ini:\n${renderCart(session.cart)}\nTotal sementara: ${formatRupiah(cartTotal(session.cart))}\n\nMau makan di tempat (dine in) atau bawa pulang (takeaway)?`;
  }

  let menu: MenuEntry[];
  try {
    menu = await fetchMenu(getSupabaseConfig(env));
  } catch (error: unknown) {
    logger.error("Gagal membaca menu saat order flow.", { error: describeError(error) });
    return GENERIC_ERROR_REPLY;
  }

  const result = matchCartText(text, menu);
  const responses: string[] = [];

  for (const { entry, quantity } of result.matched) {
    const existing = session.cart.find((line) => line.menuItemId === entry.id);
    if (existing) {
      existing.quantity = Math.min(20, existing.quantity + quantity);
    } else {
      session.cart.push({ menuItemId: entry.id, name: entry.name, price: entry.price, quantity, notes: "" });
    }
    responses.push(`Ditambahkan: ${quantity}x ${entry.name}.`);
  }

  for (const entry of result.unavailable) {
    responses.push(`Maaf, "${entry.name}" sedang habis. Coba pilih menu lain ya.`);
  }

  for (const { query, candidates } of result.ambiguous) {
    const options = candidates.map((candidate) => `- ${candidate.name}`).join("\n");
    responses.push(`"${query}" cocok dengan beberapa menu, sebutkan nama lengkapnya:\n${options}`);
  }

  for (const query of result.notFound) {
    responses.push(`Maaf, menu "${query}" tidak ditemukan. Coba cek nama menunya lagi ya.`);
  }

  if (responses.length === 0) {
    return "Belum ada menu yang cocok. Sebutkan menu dan jumlahnya, misalnya \"2 americano\".";
  }

  const cartSummary = session.cart.length > 0
    ? `\n\nKeranjang saat ini:\n${renderCart(session.cart)}\nTotal sementara: ${formatRupiah(cartTotal(session.cart))}\n\nMau tambah lagi atau ketik "selesai" kalau sudah cukup.`
    : "";

  return responses.join("\n") + cartSummary;
}

async function handleAwaitingFulfillment(env: BotEnv, session: OrderSession, text: string): Promise<string> {
  const normalized = normalize(text);

  if (DINE_IN_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    let tables;
    try {
      tables = await fetchAvailableTables(getSupabaseConfig(env));
    } catch (error: unknown) {
      logger.error("Gagal membaca daftar meja saat order flow.", { error: describeError(error) });
      return GENERIC_ERROR_REPLY;
    }

    if (tables.length === 0) {
      return "Maaf, semua meja sedang terisi. Mau diganti jadi bawa pulang (takeaway) saja?";
    }

    session.fulfillment = "dine_in";
    session.step = "awaiting_table";
    const list = tables.map((table) => `- ${table.id} (${table.label}${table.floorName ? `, ${table.floorName}` : ""})`).join("\n");
    return `Meja yang masih kosong:\n${list}\n\nSilakan sebutkan kode mejanya.`;
  }

  if (TAKEAWAY_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    session.fulfillment = "takeaway";
    session.step = "awaiting_name";
    return "Baik, dibungkus untuk dibawa pulang. Boleh tahu nama untuk pesanan ini?";
  }

  return "Mau makan di tempat (dine in) atau bawa pulang (takeaway)?";
}

async function handleAwaitingTable(env: BotEnv, session: OrderSession, text: string): Promise<string> {
  const tableCode = text.trim();

  let tables;
  try {
    tables = await fetchAvailableTables(getSupabaseConfig(env));
  } catch (error: unknown) {
    logger.error("Gagal membaca daftar meja saat validasi.", { error: describeError(error) });
    return GENERIC_ERROR_REPLY;
  }

  const table = tables.find((candidate) => candidate.id.toLowerCase() === tableCode.toLowerCase());
  if (!table) {
    if (tables.length === 0) {
      session.fulfillment = null;
      session.step = "awaiting_fulfillment";
      return "Maaf, meja itu tidak tersedia dan semua meja lain sudah terisi. Mau diganti jadi bawa pulang (takeaway) saja?";
    }
    const list = tables.map((candidate) => `- ${candidate.id} (${candidate.label})`).join("\n");
    return `Meja tidak ditemukan atau sedang tidak tersedia. Pilih salah satu:\n${list}`;
  }

  session.tableCode = table.id;
  session.step = "awaiting_name";
  return "Boleh tahu nama untuk pesanan ini?";
}

function handleAwaitingName(session: OrderSession, text: string): string {
  const name = text.trim();
  if (name.length < 2 || name.length > 80) {
    return "Nama harus 2-80 karakter. Boleh diulang sebutkan namanya?";
  }

  session.customerName = name;
  session.step = "awaiting_phone";
  return "Boleh minta nomor WhatsApp/HP-nya untuk konfirmasi pesanan?";
}

function handleAwaitingPhone(session: OrderSession, text: string): string {
  const phone = text.trim().replace(/[\s-]/g, "");
  if (!/^[0-9]{8,15}$/.test(phone)) {
    return "Nomor HP harus berupa angka, 8-15 digit (tanpa spasi/simbol). Boleh diulang?";
  }

  session.phone = phone;
  session.step = "awaiting_confirmation";

  const fulfillmentLabel = session.fulfillment === "dine_in" ? `Dine in - Meja ${session.tableCode}` : "Bawa pulang";
  return [
    "Berikut ringkasan pesanan:",
    renderCart(session.cart),
    `Total: ${formatRupiah(cartTotal(session.cart))}`,
    `Fulfillment: ${fulfillmentLabel}`,
    `Nama: ${session.customerName}`,
    `HP: ${session.phone}`,
    "",
    "Untuk memproses pesanan, ketik \"bayar\" (mode development).",
  ].join("\n");
}

async function handleAwaitingConfirmation(env: BotEnv, chatId: string, session: OrderSession, text: string): Promise<string> {
  if (normalize(text) !== "bayar") {
    return "Ketik \"bayar\" untuk memproses pesanan, atau \"batal\" untuk membatalkan.";
  }

  if (!session.fulfillment || !session.customerName || !session.phone) {
    return GENERIC_ERROR_REPLY;
  }

  const supabaseConfig = getSupabaseConfig(env);
  const botUserId = getBotUserId(env);

  let order;
  try {
    order = await createCafeOrder(
      supabaseConfig,
      botUserId,
      session.idempotencyKey,
      session.customerName,
      session.phone,
      session.fulfillment,
      session.tableCode,
      session.cart,
    );
  } catch (error: unknown) {
    // Pesan ke user tetap ringkas (RPC melempar pesan Indonesia yang layak
    // ditampilkan langsung, mis. "Meja tidak tersedia..."); log terpisah
    // pakai describeError supaya ada stack trace/detail lengkap kalau
    // errornya bukan dari RPC (mis. network/bug kode).
    const userMessage = error instanceof Error ? error.message : String(error);
    logger.error("Gagal membuat pesanan.", { identity: hashIdentity(chatId), error: describeError(error) });
    return `Maaf, pesanan belum bisa diproses: ${userMessage}`;
  }

  try {
    order = await markOrderPaid(supabaseConfig, order.id);
  } catch (error: unknown) {
    const userMessage = error instanceof Error ? error.message : String(error);
    logger.error("Gagal menandai pesanan lunas.", { identity: hashIdentity(chatId), orderId: order.id, error: describeError(error) });
    return `Pesanan sudah tercatat dengan nomor antrian ${order.queue_number}, tapi konfirmasi bayar belum berhasil: ${userMessage}. Hubungi kasir untuk konfirmasi manual.`;
  }

  clearSession(chatId);

  return [
    "Pembayaran berhasil dikonfirmasi! 🎉",
    `Nomor antrian: ${order.queue_number}`,
    `Total: ${formatRupiah(order.total)}`,
    "Terima kasih sudah pesan di CafeSite!",
  ].join("\n");
}
