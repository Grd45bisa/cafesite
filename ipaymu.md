# Spesifikasi Integrasi QRIS iPaymu

> Diekstrak dari https://docs.ipaymu.com/id/docs (dan sub-halaman terkait: `getting-started`, `signature`, `callback`, `payment/payment-channels`, `payment/direct-payment`, `payment/redirect-payment`, `ip-domain-validation`, `transaction/check-transaction`, `transaction/history-transaction`, `cod`, `verification`, `area-api`) pada tanggal pengambilan sesi ini. Hanya berisi informasi yang benar-benar ada di dokumentasi — bagian yang tidak dijelaskan/ambigu ditandai `[RAGU]`.

---

## 1. Ringkasan Cara Kerja QRIS iPaymu (5 baris)

1. QRIS di iPaymu dibuat lewat endpoint **Direct Payment** (`POST /api/v2/payment/direct`) dengan `paymentMethod: "qris"` dan `paymentChannel: "mpm"` — bukan lewat Redirect Payment (redirect payment mendukung QRIS lewat UI hosted, tapi tidak bisa dipilih otomatis lewat parameter).
2. Setiap request wajib disertai 3 header autentikasi: `va`, `signature`, dan `timestamp`, di mana `signature` dihasilkan dari kombinasi HMAC-SHA256 antara method, VA, body request, dan API Key.
3. Response sukses berisi `TransactionId`, `PaymentNo`, dan `Url` yang mengarah ke halaman/QR pembayaran untuk ditampilkan ke pembeli.
4. Setelah pembeli membayar, iPaymu mengirim **callback/webhook POST** ke `notifyUrl` yang didaftarkan, berisi status transaksi — endpoint kita wajib membalas `200 OK` dan memverifikasi header `X-Signature` sebelum mempercayai payload.
5. Untuk cek status manual (bukan lewat callback), tersedia endpoint `POST /api/v2/transaction` dengan `transactionId`, mengembalikan kode status numerik (0=pending, 1=success, dst).

---

## 2. Daftar Endpoint (Sandbox + Production)

| Endpoint | Method | Production | Sandbox | Sumber |
|---|---|---|---|---|
| Direct Payment (QRIS) | POST | `https://my.ipaymu.com/api/v2/payment/direct` | **[RAGU]** — dokumentasi halaman Direct Payment **tidak menyebutkan URL sandbox sama sekali**, hanya production yang eksplisit tercantum | `/id/docs/payment/direct-payment` |
| Redirect Payment | POST | `{{baseUrl}}/api/v2/payment` (base production `https://my.ipaymu.com`) | `https://sandbox.ipaymu.com/api/v2/payment` (eksplisit disebutkan) | `/id/docs/payment/redirect-payment` |
| Payment Channels (list) | GET | `{{baseUrl}}/api/v2/payment-channels` | pakai base sandbox yang sama | `/id/docs/payment/payment-channels` |
| Cek Transaksi | POST | `{{baseUrl}}/api/v2/transaction` | pakai base sandbox yang sama | `/id/docs/transaction/check-transaction` |
| Riwayat Transaksi | POST | `{{baseUrl}}/api/v2/history` | pakai base sandbox yang sama | `/id/docs/transaction/history-transaction` |
| Area (provinsi/kota/dst) | GET | `https://my.ipaymu.com/api/areas/...` | `https://sandbox.ipaymu.com/api/areas/...` | `/id/docs/area-api` |

**Base URL umum** (dari halaman pengantar `/id/docs`):
- Production: `https://my.ipaymu.com`
- Sandbox: `https://sandbox.ipaymu.com`

`[RAGU]` Karena halaman Direct Payment hanya mencantumkan URL production, asumsi paling wajar (mengikuti pola base URL umum di atas) adalah sandbox-nya `https://sandbox.ipaymu.com/api/v2/payment/direct` — **tapi ini tidak dikonfirmasi eksplisit dalam dokumentasi** yang berhasil diambil. Sebaiknya divalidasi langsung dengan tim support iPaymu atau dicoba di sandbox sebelum production.

---

## 3. Contoh Kode Request & Response QRIS

### Request (curl)

```bash
curl -X POST "https://my.ipaymu.com/api/v2/payment/direct" \
  -H "Content-Type: application/json" \
  -H "va: 0000001234567890" \
  -H "signature: <HASIL_HMAC_SHA256>" \
  -H "timestamp: 20250101120000" \
  -d '{
    "name": "Pelanggan",
    "phone": "08123456789",
    "email": "buyer@mail.com",
    "amount": 50000,
    "notifyUrl": "https://mywebsite.com/api/ipaymu/callback",
    "paymentMethod": "qris",
    "paymentChannel": "mpm",
    "product": ["Layanan Premium"],
    "qty": [1],
    "price": [50000]
  }'
```

### Field Request — QRIS Direct Payment

| Field | Wajib | Tipe | Keterangan |
|---|---|---|---|
| `name` | Ya | string | Nama pembeli |
| `phone` | Ya | string | Nomor HP pembeli |
| `email` | Ya | string | Email pembeli |
| `amount` | Ya | number | Total nominal pembayaran |
| `notifyUrl` | Ya | string | URL webhook untuk menerima callback |
| `paymentMethod` | Ya | string | Diisi `"qris"` |
| `paymentChannel` | Ya | string | Diisi `"mpm"` |
| `product[]` | Ya | array\<string\> | Nama-nama produk |
| `qty[]` | Ya | array\<number\> | Jumlah tiap produk |
| `price[]` | Ya | array\<number\> | Harga satuan tiap produk |
| `expired` | Tidak | number | Lama waktu kedaluwarsa, default **24** |
| `expiredType` | Tidak | string | Satuan durasi: `days`, `hours`, atau `minutes` |
| `comments` | Tidak | string | Catatan transaksi |
| `referenceId` | Tidak | string | ID referensi dari sistem kita sendiri |

`[RAGU]` Field `returnUrl` dan `cancelUrl` **tidak disebutkan** di halaman Direct Payment — kemungkinan field itu memang khusus untuk Redirect Payment saja, tapi dokumentasi tidak menegaskan apakah Direct Payment mendukungnya juga (mis. untuk redirect setelah scan QR sukses di beberapa gateway).

`[RAGU]` Tidak ada batas nominal minimum/maksimum untuk QRIS yang disebutkan di halaman manapun yang berhasil diambil.

### Response Sukses

```json
{
  "Status": 200,
  "Success": true,
  "Message": "Success",
  "Data": {
    "TransactionId": 12345,
    "ReferenceId": "REF123456",
    "Via": "qris",
    "Channel": "mpm",
    "PaymentNo": "1234567890",
    "PaymentName": "QRIS Payment",
    "Total": 50000,
    "Fee": 0,
    "Expired": "2023-12-31 23:59:59",
    "Url": "https://my.ipaymu.com/payment/12345"
  }
}
```

Catatan dari dokumentasi: *"Pengguna akan mendapatkan `Url` redirect atau QR/deep link pembayaran pada respon data."* — `[RAGU]` dokumentasi tidak menjelaskan secara eksplisit apakah `Url` ini adalah gambar QR langsung, halaman yang menampilkan QR, atau deep link ke aplikasi e-wallet. Perlu dicek langsung lewat response sandbox sungguhan (buka `Url` di browser untuk lihat bentuknya).

---

## 4. Cara Generate Signature — Langkah demi Langkah

**Algoritma:** HMAC-SHA256, output hex lowercase.

**Formula string yang di-sign:**
```
StringToSign = Method + ":" + VA + ":" + RequestBody + ":" + APIKey
Signature   = HMAC-SHA256(StringToSign, APIKey)   // key HMAC = APIKey, hasil dalam hex
```

**Langkah:**
1. Tentukan `Method` — `GET` atau `POST` (huruf besar sesuai HTTP verb).
2. Siapkan `RequestBody`:
   - Kalau `GET`: gunakan query parameter yang di-stringify jadi JSON.
   - Kalau `POST`: hash body JSON request dengan **SHA-256** dulu (hasil hex), baru dipakai sebagai komponen `RequestBody` di formula di atas.
3. Gabungkan jadi satu string: `Method:VA:RequestBody:APIKey`.
4. HMAC-SHA256 string gabungan itu dengan **APIKey sebagai secret key**, hasil dalam hex lowercase — inilah `signature`.
5. Kirim 3 header di setiap request: `va`, `signature`, `timestamp` (format `YYYYMMDDHHmmss`).

**Contoh alur (Node.js, konsep dari dokumentasi — memakai `crypto-js` untuk SHA256 & HmacSHA256):**

```js
const CryptoJS = require("crypto-js");

function generateSignature(method, va, apiKey, bodyObject) {
  const bodyHash = CryptoJS.SHA256(JSON.stringify(bodyObject)).toString(CryptoJS.enc.Hex);
  const stringToSign = `${method}:${va}:${bodyHash}:${apiKey}`;
  return CryptoJS.HmacSHA256(stringToSign, apiKey).toString(CryptoJS.enc.Hex);
}
```

`[RAGU]` Dokumentasi menyediakan contoh kode Node.js memakai library `crypto-js`, tapi detail baris-per-baris lengkapnya tidak seluruhnya terbawa saat ekstraksi — di atas adalah rekonstruksi berdasarkan formula dan deskripsi proses yang diberikan, **bukan salinan literal kode dari dokumentasi**. Sebaiknya buka halaman `/id/docs/signature` langsung untuk menyalin contoh kode aslinya kata demi kata sebelum implementasi produksi.

---

## 5. Format Callback/Webhook & Cara Verifikasi

### Payload yang dikirim ke `notifyUrl`

Format bisa `application/x-www-form-urlencoded` (default/rekomendasi) atau `application/json` — dipilih di dashboard.

| Field | Tipe | Keterangan |
|---|---|---|
| `trx_id` | integer | ID transaksi iPaymu |
| `sid` | — | — (tidak dijelaskan lebih lanjut) |
| `reference_id` | string | Reference ID dari sistem kita |
| `status` | string | Status transaksi |
| `status_code` | — | Kode status |
| `sub_total`, `total`, `amount`, `fee` | string | Nilai nominal (dikirim sebagai string) |
| `paid_off` | integer | — |
| `created_at`, `expired_at`, `paid_at` | — | Timestamp |
| `settlement_status` | — | Status settlement |
| `via`, `channel`, `payment_no`, `va` | — | Detail metode pembayaran |
| `system_notes` | — | Catatan sistem |
| `buyer_name`, `buyer_email`, `buyer_phone` | — | Data pembeli |
| `additional_info` | array | Info tambahan |
| `url` | — | — |
| `is_escrow` | boolean | — |
| `transaction_status_code` | — | — |

`[RAGU]` Deskripsi lengkap tiap field (terutama `sid`, `status_code` vs `transaction_status_code`, dan format persis `status` — apakah string angka atau label seperti `"berhasil"`) tidak sepenuhnya tergambar jelas dari ekstraksi; disarankan cek contoh payload mentah langsung di halaman `/id/docs/callback` atau lewat log request sandbox sungguhan.

### Verifikasi callback

**Header penting:**
- `X-Signature`: HMAC-SHA256 hash untuk verifikasi.
- `X-External-ID`: ID unik request.
- `X-Timestamp`: timestamp ISO 8601.
- `Accept: application/json`.

**Langkah verifikasi (secret key = Nomor VA merchant, BUKAN API Key):**
1. Normalisasi tipe data payload (ubah string ke integer/boolean sesuai kebutuhan).
2. Urutkan semua key payload secara alfabetis (A→Z).
3. Ubah jadi string JSON, dengan karakter `/` di-escape jadi `\/`.
4. Hitung HMAC-SHA256 dari string JSON itu, pakai **Nomor VA** sebagai secret key.
5. Bandingkan hasil hash dengan nilai di header `X-Signature` — kalau cocok, callback dianggap valid.

### Response yang harus dikembalikan

**Wajib balas `200 OK`.** Dokumentasi menyebutkan: *"iPaymu akan otomatis melakukan retry jika tidak menerima response 200."* — `[RAGU]` tidak dijelaskan berapa kali retry dilakukan atau jeda antar retry.

---

## 6. Daftar Kode/Status Penting

**Status Transaksi** (dari endpoint Cek Transaksi, `POST /api/v2/transaction`):

| Kode | Arti |
|---|---|
| 0 | Pending (menunggu pembayaran) |
| 1 | Success |
| 2 | Cancelled |
| 3 | Refund |
| 4 | Error |
| 5 | Failed |
| 6 | Success - Unsettled |
| 7 | Escrow |
| -2 | Expired |

**Error validasi IP/Domain** (khusus mode Production):
- `Invalid IP` — IP server tidak terdaftar/tidak statis.
- `Invalid Domain` — domain di `notifyUrl`/`returnUrl`/`cancelUrl` belum terdaftar & diverifikasi.

`[RAGU]` **Tidak ditemukan daftar kode error umum API** (mis. error validasi field, signature salah, saldo tidak cukup, dsb) di halaman manapun yang berhasil diakses dalam sesi ini. Dokumentasi Direct Payment secara eksplisit menyatakan *"Documentation does not include error codes list"*. Kemungkinan besar ada halaman error-code terpisah yang tidak muncul di navigasi yang berhasil dijelajahi — perlu dicari manual lewat search di situs dokumentasi atau ditanyakan ke support iPaymu.

---

## 7. Checklist Persiapan Project Next.js (Serverless, Tanpa Database)

### Environment Variables (`.env.local` / Vercel dashboard)

```
IPAYMU_VA=<Nomor VA dari dashboard Integrasi>
IPAYMU_API_KEY=<API Key dari dashboard Integrasi>
IPAYMU_MODE=sandbox   # atau "production"
IPAYMU_BASE_URL=https://sandbox.ipaymu.com   # ganti https://my.ipaymu.com untuk production
NEXT_PUBLIC_APP_URL=https://domainkamu.com   # dipakai untuk notifyUrl/returnUrl
```

### File yang perlu dibuat

| File | Fungsi |
|---|---|
| `src/lib/ipaymu/signature.ts` | Fungsi generate signature (HMAC-SHA256 sesuai formula bagian 4) |
| `src/lib/ipaymu/client.ts` | Wrapper `fetch` ke iPaymu — set header `va`/`signature`/`timestamp` otomatis, pilih base URL sesuai `IPAYMU_MODE` |
| `src/app/api/ipaymu/checkout/route.ts` | Endpoint server kita yang dipanggil dari checkout, meneruskan request Direct Payment QRIS ke iPaymu, return `Url`/`PaymentNo` ke frontend |
| `src/app/api/ipaymu/callback/route.ts` | Endpoint `notifyUrl` — terima POST dari iPaymu, verifikasi `X-Signature` (secret = VA, bukan API Key), lalu proses status pembayaran, **wajib return 200** |
| `src/lib/ipaymu/verify-callback.ts` | Fungsi khusus verifikasi callback (langkah normalisasi → sort key → escape `/` → HMAC dengan VA) — **berbeda dari signature request biasa**, jangan disatukan supaya tidak salah pakai secret key |

### Hal khusus untuk arsitektur "tanpa database"

- Karena tidak ada DB untuk menyimpan status transaksi, `transactionId`/`referenceId` dari response Direct Payment harus **disimpan di tempat lain yang bisa diakses ulang saat callback masuk** — misalnya di URL redirect (`returnUrl`/query param), session/cookie, atau layanan KV eksternal (mis. Vercel KV/Upstash Redis) — dokumentasi iPaymu sendiri tidak mengatur ini, murni keputusan arsitektur project.
- **Vercel serverless functions memakai IP dinamis** (bukan IP statis tetap) — ini berbenturan langsung dengan requirement dokumentasi bagian 5 yang menyatakan *"IP statis wajib untuk mode Production"* dan localhost/IP dinamis akan menyebabkan error `Invalid IP`. `[RAGU]` Dokumentasi tidak menjelaskan solusi untuk platform serverless seperti Vercel — kemungkinan perlu outbound proxy dengan IP statis (mis. QuotaGuard, Fixie) atau konfirmasi langsung ke support iPaymu apakah ada pengecualian untuk permintaan yang datang dari domain terverifikasi meski IP asal berubah-ubah. **Ini isu paling kritis yang harus diklarifikasi sebelum production**, sandbox tidak mensyaratkan ini jadi tidak akan terlihat masalahnya sampai pindah ke production.
- Domain (untuk `notifyUrl`, `returnUrl`, `cancelUrl`) harus didaftarkan & diverifikasi dulu di [Domain Management](https://my.ipaymu.com/domain) sebelum go-live (proses reviewnya sampai 2 hari kerja) — siapkan ini jauh-jauh hari, jangan mepet deadline.

---

## 8. Ringkasan Bagian yang Ditandai [RAGU]

1. **URL sandbox untuk Direct Payment (QRIS)** — tidak disebutkan eksplisit di dokumentasi, hanya production.
2. **Field `returnUrl`/`cancelUrl` untuk Direct Payment** — tidak disebutkan, tidak jelas apakah didukung.
3. **Batas nominal minimum/maksimum QRIS** — tidak ditemukan di halaman manapun.
4. **Bentuk pasti field `Url` di response** (gambar QR langsung vs halaman vs deep link) — deskripsi dokumentasi ambigu.
5. **Contoh kode signature asli dari dokumentasi** — versi di dokumen ini adalah rekonstruksi dari deskripsi proses, bukan salinan literal.
6. **Detail lengkap tiap field callback** (terutama `sid`, `status` vs `status_code` vs `transaction_status_code`) — tidak sepenuhnya jelas dari ekstraksi.
7. **Jumlah/interval retry callback** jika endpoint kita tidak membalas 200 — tidak dijelaskan.
8. **Daftar kode error API umum** (signature salah, saldo kurang, field tidak valid, dsb) — tidak ditemukan sama sekali di halaman-halaman yang berhasil diakses; kemungkinan ada di halaman terpisah yang tidak muncul di navigasi yang dijelajahi.
9. **Solusi IP statis untuk platform serverless (Vercel)** — dokumentasi mengasumsikan server dengan IP statis tetap, tidak membahas skenario serverless sama sekali. Ini paling penting untuk diklarifikasi langsung ke iPaymu sebelum production, karena konteks project ini eksplisit serverless di Vercel.

---

**Catatan metodologi:** Ekstraksi dilakukan dengan menjelajahi ~13 halaman dokumentasi mengikuti link internal yang saling mereferensikan (bukan crawl otomatis penuh situs). Ada kemungkinan halaman lain (mis. QRIS-specific page terpisah, error-code reference, atau Balance sub-pages) belum terjangkau dalam sesi ini. Jika ditemukan halaman lanjutan yang relevan, dokumen ini perlu diperbarui.
