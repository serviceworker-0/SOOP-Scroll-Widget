export async function onRequest(context) {
  const destination =
    context.request.headers.get("Sec-Fetch-Dest");

  if (destination !== "iframe") {
    return new Response(
      JSON.stringify({
        ok: false,
        code: "CONTENT_EMBED_ONLY",
        message:
          "위젯 실행 문서는 안전한 MotionKit 프레임 안에서만 열 수 있습니다."
      }),
      {
        status: 403,
        headers: {
          "Content-Type":
            "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const response = await context.next();
  const headers = new Headers(response.headers);

  headers.delete("X-Frame-Options");
  headers.set(
    "Content-Security-Policy",
    "frame-ancestors *"
  );
  headers.set(
    "Cross-Origin-Resource-Policy",
    "cross-origin"
  );
  headers.set(
    "Referrer-Policy",
    "no-referrer"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
