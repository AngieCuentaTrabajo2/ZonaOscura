# ZonaOscura

Prototipo responsive para reportar, visualizar y gestionar zonas con deficiente iluminación pública. El caso corresponde a la Semana 08 del curso Diseño e Implementación en Ambientes Emergentes.

## Objetivo

ZonaOscura permite que ciudadanos y juntas vecinales registren calles oscuras, adjunten evidencia y consulten puntos de riesgo. También ofrece a la municipalidad un panel para priorizar reportes, revisar historial de zonas atendidas y generar informes operativos.

## Historias de usuario cubiertas

- **US01:** registrar una calle sin iluminación con ubicación, descripción y evidencia.
- **US02:** visualizar zonas oscuras en un mapa responsive.
- **US03:** consultar historial de zonas atendidas por la municipalidad.
- **US04:** revisar prioridades y generar un informe municipal.

## Funcionalidades principales

- Registro y seguimiento de reportes ciudadanos.
- Selección de ubicación en mapa simulado y evidencia fotográfica.
- Visualización de zonas oscuras con estados y prioridades.
- Detalle del reporte con confirmación ciudadana.
- Panel municipal con indicadores.
- Historial de reportes atendidos.
- Priorización de casos críticos.
- Vista previa y descarga de informes operativos.

## Tecnologías

- Next.js 14
- React
- Tailwind CSS
- Prisma
- PostgreSQL en Supabase
- NextAuth

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Base de datos

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

## Validación

```bash
pnpm build
```
