import { ImageResponse } from "next/og";

export const alt = "GSAB — Google Sheets as a Backend";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#f7f6f2",
          color: "#16150f",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: 44, height: 44, gap: 4 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "#1b7a4b" }} />
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "#d6d3c8" }} />
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "#d6d3c8" }} />
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "#d6d3c8" }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>GSAB</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
            }}
          >
            Google Sheets,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ marginRight: 22 }}>as your</span>
            <span style={{ color: "#1b7a4b" }}>backend.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 27,
            color: "#4d4a40",
          }}
        >
          <div style={{ display: "flex" }}>pip install gsab</div>
          <div style={{ display: "flex" }}>gsab.ajmalaksar.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
