# Producción en AWS

## Arquitectura actual recomendada

- `frontend`: AWS Amplify Hosting en `www.tudominio.com`
- `backend`: AWS Elastic Beanstalk con `Application Load Balancer` en `api.tudominio.com`
- `media`: bucket S3 para imágenes del catálogo
- `cdn media`: CloudFront en `media.tudominio.com`
- `dns`: Route 53
- `database`: RDS PostgreSQL

## Por qué esta ruta

- ya tienes Elastic Beanstalk y ALB
- te da HTTPS limpio sin tocar Nginx manualmente
- te permite terminar rápido y reevaluar costos después
- evita que mezclemos una migración de infraestructura con la salida a producción

## Backend en Elastic Beanstalk

El backend ya quedó listo para:

- leer `PORT` desde entorno
- confiar en proxy mediante `TRUST_PROXY`
- exponer `GET /health`
- limitar CORS con `WEB_ORIGINS`
- configurar cookies con `COOKIE_SAME_SITE`, `COOKIE_SECURE` y `COOKIE_DOMAIN`
- guardar imágenes en S3

Archivo de referencia:

- [`backend/.env.example`](/Users/juancarlosarenasgutierrez/Documents/Projects/ecommerce-catalogo/backend/.env.example)

## HTTPS con ALB

Elastic Beanstalk recomienda terminar HTTPS en el load balancer para entornos con ALB.

Pasos:

1. Solicita un certificado en ACM para `api.tudominio.com`.
2. En Elastic Beanstalk, abre la configuración del Load Balancer.
3. Agrega el listener `443 HTTPS` con ese certificado.
4. Mantén el tráfico del ALB hacia la app por `HTTP` interno.
5. Apunta `api.tudominio.com` en Route 53 al ALB/entorno.

Referencia de configuración:

- [`backend/.ebextensions/01-process-health.config`](/Users/juancarlosarenasgutierrez/Documents/Projects/ecommerce-catalogo/backend/.ebextensions/01-process-health.config)
- [`backend/.ebextensions/02-https-listener-alb.config.example`](/Users/juancarlosarenasgutierrez/Documents/Projects/ecommerce-catalogo/backend/.ebextensions/02-https-listener-alb.config.example)

## Frontend en Amplify

El frontend se puede desplegar desde este mismo monorepo usando Amplify.

Pasos:

1. Conecta el repositorio en Amplify.
2. Selecciona `frontend` como app root.
3. Define `AMPLIFY_MONOREPO_APP_ROOT=frontend`.
4. Define `VITE_API_URL=https://api.tudominio.com`.
5. Publica el dominio `www.tudominio.com`.

Archivo de build:

- [`amplify.yml`](/Users/juancarlosarenasgutierrez/Documents/Projects/ecommerce-catalogo/amplify.yml)

## Cookies y CORS por fases

### Fase temporal

Si frontend sigue en `vercel.app` y backend ya vive en `api.tudominio.com`:

- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`
- `WEB_ORIGINS=https://tu-frontend.vercel.app`

Esto es por el cruce entre sitios distintos.

### Fase final recomendada

Si frontend vive en `www.tudominio.com` y backend en `api.tudominio.com`:

- `COOKIE_SAME_SITE=lax`
- `COOKIE_SECURE=true`
- `WEB_ORIGINS=https://www.tudominio.com,https://tudominio.com`
- `COOKIE_DOMAIN=` vacío, salvo que tengas una razón específica

Esta fase es más limpia y normalmente evita problemas de sesión entre dominios externos.

## S3 y media

Recomendación:

- bucket dedicado solo para imágenes
- versionado habilitado
- cifrado habilitado
- backend con permisos de escritura mínimos
- servir públicamente por CloudFront usando `S3_PUBLIC_URL_BASE=https://media.tudominio.com`

## Catálogo real

Importación disponible:

```bash
cd backend
npm run catalog:import -- ./catalog/catalog.json
```

Referencia:

- [`backend/catalog/catalog.example.json`](/Users/juancarlosarenasgutierrez/Documents/Projects/ecommerce-catalogo/backend/catalog/catalog.example.json)

## Checklist de salida

- `api.tudominio.com` responde `GET /health` por HTTPS
- `www.tudominio.com` publicado desde Amplify
- `VITE_API_URL` apunta a `https://api.tudominio.com`
- `WEB_ORIGINS` refleja solo los dominios reales del frontend
- imágenes nuevas suben a S3
- catálogo real importado en la base productiva
