import { ImageResponse } from "next/og";

export const alt = "이슈있슈";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          color: "white",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        이슈있슈
      </div>
    ),
    {
      ...size,
    },
  );
}
