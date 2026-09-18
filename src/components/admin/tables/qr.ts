import QRCode from "qrcode";

export function tableOrderUrl(origin: string, tableId: string): string {
  const url = new URL("/order", origin);
  url.searchParams.set("meja", tableId);
  return url.toString();
}

const options = { margin: 2, width: 640, color: { dark: "#000000", light: "#ffffff" } } as const;

export async function qrPng(url: string): Promise<string> {
  return QRCode.toDataURL(url, { ...options, errorCorrectionLevel: "H" });
}

export async function qrSvg(url: string): Promise<string> {
  return QRCode.toString(url, { ...options, type: "svg", errorCorrectionLevel: "H" });
}

export function downloadData(filename: string, data: string, mimeType?: string): void {
  const anchor = document.createElement("a");
  anchor.download = filename;
  anchor.href = mimeType ? URL.createObjectURL(new Blob([data], { type: mimeType })) : data;
  anchor.click();
  if (mimeType) window.setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
}
