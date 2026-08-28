import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("avatar");

  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Selecione um arquivo válido." }, { status: 400 });
  }

  // O tipo vem do cliente: só aceitamos a lista conhecida e derivamos a extensão
  // dela, em vez de confiar no nome do arquivo enviado.
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Formato não suportado. Envie JPG, PNG, WebP ou GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "A imagem deve ter no máximo 5 MB." },
      { status: 400 }
    );
  }

  const { supabase, user } = await getSession();
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url), 303);
  }

  const fileName = `${user.id}-${Date.now()}.${extension}`;
  const fileData = await file.arrayBuffer();

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, new Uint8Array(fileData), {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Não foi possível enviar a imagem." },
      { status: 500 }
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(uploadData.path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrlData.publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Não foi possível salvar a foto no perfil." },
      { status: 500 }
    );
  }

  return NextResponse.redirect(new URL("/dashboard/profile", request.url), 303);
}
