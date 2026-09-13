import { ImageResponse } from "next/og";
import { SITE_URL, siteConfig } from "@/config/site";

export const alt = `${siteConfig.siteName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#20201E",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
        }}
      >
        <div
          style={{
            color: "#C8A98A",
            fontSize: "34px",
            letterSpacing: "9px",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          Kedai Kopi &amp; Tempat Nyantai
        </div>
        <div
          style={{
            color: "#F1EEE8",
            fontSize: "104px",
            fontWeight: 700,
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: "36px",
            width: "120px",
            height: "6px",
            background: "#A6533F",
            borderRadius: "9999px",
          }}
        />
        <div
          style={{
            color: "#C5BFB2",
            fontSize: "30px",
            maxWidth: "900px",
            marginTop: "30px",
            lineHeight: 1.45,
          }}
        >
          Kopi single origin Nusantara, ruang hangat buat kerja bareng Wi-Fi
          kencang &amp; colokan, di tengah Jakarta Selatan. Terbuka hari ini.
        </div>
        <div
          style={{
            color: "#A6533F",
            fontSize: "22px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginTop: "44px",
          }}
        >
          {SITE_URL}
        </div>
      </div>
    ),
    { ...size }
  );
}