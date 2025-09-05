import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? "9";
  const tagParam = searchParams.get("tag") ?? "";
  const search = searchParams.get("search") ?? "";

  // Ігноруємо тег "All"
  const tag = tagParam.toLowerCase() === "all" ? "" : tagParam;

  try {
    const { data } = await api.get("/notes", {
      params: { page, perPage, tag, search },
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /notes error:", error);
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).response?.status ?? 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const { data } = await api.post("/notes", body, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /notes error:", error);
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).response?.status ?? 500 }
    );
  }
}
