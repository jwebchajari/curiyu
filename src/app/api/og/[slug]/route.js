import { getNewsBySlug } from "@/lib/firebase/news";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request, { params }) {
    const news = await getNewsBySlug(params.slug);
    if (!news) {
        return new Response("Not found", { status: 404 });
    }

    const image = new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #198754 0%, #0d1b2a 100%)",
                    color: "white",
                    padding: "40px",
                    textAlign: "center",
                }}
            >
                <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 20 }}>Club Curiyú</div>
                <div style={{ fontSize: 28, maxWidth: "800px" }}>{news.title}</div>
                {news.excerpt && (
                    <div style={{ fontSize: 18, opacity: 0.8, marginTop: 20, maxWidth: "700px" }}>
                        {news.excerpt.substring(0, 120)}
                    </div>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );

    return new Response(image.body, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}
