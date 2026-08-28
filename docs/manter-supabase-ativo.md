# Manter o Supabase ativo

Projetos no plano gratuito do Supabase podem ser pausados após uma semana com pouca atividade. Não existe comando SQL ou gatilho no PostgreSQL que altere essa regra da plataforma.

Este projeto disponibiliza o endpoint protegido `GET /api/internal/keep-alive`. Ele faz uma consulta simples ao banco, suficiente para registrar atividade quando chamado por uma agenda externa.

## Configuração

No ambiente de produção, defina as variáveis abaixo com valores secretos e diferentes entre si:

```env
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
CRON_SECRET=um-segredo-longo-e-aleatorio
```

## Agendamento automático (já configurado no repositório)

Duas rotinas independentes chamam o endpoint, para que a pausa não dependa de
um único serviço:

1. **Vercel Cron** — `vercel.json` agenda `/api/internal/keep-alive` todos os
   dias às 06:00 UTC. A Vercel envia sozinha o cabeçalho
   `Authorization: Bearer $CRON_SECRET` quando a variável `CRON_SECRET` existe
   nas variáveis de ambiente do projeto. Basta definir `CRON_SECRET` no painel
   da Vercel (Production) — nada mais é necessário.

2. **GitHub Actions** — `.github/workflows/keep-alive.yml` repete a chamada às
   segundas e quintas. Exige dois secrets no repositório
   (Settings → Secrets and variables → Actions):

   | Secret | Valor |
   | --- | --- |
   | `APP_URL` | URL de produção, sem barra final (ex.: `https://ocral.vercel.app`) |
   | `CRON_SECRET` | o mesmo valor definido na Vercel |

   O workflow também pode ser disparado manualmente em Actions → *Manter
   Supabase ativo* → *Run workflow*, útil para testar a configuração.

Como o Supabase pausa após cerca de sete dias de inatividade, qualquer uma das
duas rotinas sozinha já mantém o banco ativo; juntas, cobrem a falha da outra.

## Agendamento manual (alternativa)

Se preferir um serviço externo de monitoramento, agende uma chamada diária ao
endereço abaixo:

```text
https://SEU-DOMINIO/api/internal/keep-alive
```

Envie um destes cabeçalhos na chamada:

```text
Authorization: Bearer <CRON_SECRET>
```

ou:

```text
x-cron-secret: <CRON_SECRET>
```

O endpoint devolve `200` com `{"status":"ok"}` quando a consulta ao banco funciona. Não coloque o segredo na URL, em código do cliente ou em variáveis `NEXT_PUBLIC_*`.

## Opção definitiva

Em ambiente de produção, migre a organização para um plano pago do Supabase. Projetos pagos não sofrem pausa automática por inatividade.
