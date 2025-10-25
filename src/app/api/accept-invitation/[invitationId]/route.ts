import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const { invitationId } = await params;

  try {
    const hdrs = Object.fromEntries((await headers()).entries());

    const data = await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: hdrs,
    });

    if (!data) {
      return NextResponse.json(
        { error: "Falha ao aceitar convite" },
        { status: 400 },
      );
    }

    // Retornar um redirect usando NextResponse
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Erro ao aceitar convite:", error);

    // Verificar se é erro de autorização
    const err = error as unknown;
    if (
      typeof err === "object" &&
      err !== null &&
      "statusCode" in err &&
      (err as { statusCode?: number }).statusCode === 401
    ) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para aceitar o convite." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
