// Origens autorizadas para Server Actions. Além do desenvolvimento local,
// aceitamos a URL pública configurada e o domínio de produção da Vercel
// (VERCEL_URL muda a cada deploy de preview).
const allowedOrigins = ["localhost:3000", "ocral.vercel.app"];

for (const value of [process.env.NEXT_PUBLIC_APP_URL, process.env.VERCEL_URL]) {
  if (!value) continue;
  try {
    // VERCEL_URL vem sem protocolo; NEXT_PUBLIC_APP_URL vem com.
    const host = new URL(value.includes("://") ? value : `https://${value}`).host;
    if (!allowedOrigins.includes(host)) allowedOrigins.push(host);
  } catch {
    // Origem inválida não derruba o build; o deploy segue com os padrões.
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
