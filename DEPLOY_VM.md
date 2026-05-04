# Deploy em VM com Docker

## Requisitos

- Docker
- Docker Compose
- Porta `3000` liberada

## Subir

```bash
cp .env.example .env
```

Edite `.env` e preencha pelo menos:

```env
BETTER_AUTH_SECRET=
NEXT_PUBLIC_APP_URL=http://SEU_IP:3000
BETTER_AUTH_URL=http://SEU_IP:3000
```

Depois rode:

```bash
docker compose up -d --build
```

O app fica em:

```text
http://SEU_IP:3000
```

## Ver logs

```bash
docker compose logs -f app
```

## Parar

```bash
docker compose down
```

Para apagar também o banco:

```bash
docker compose down -v
```
