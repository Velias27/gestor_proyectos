#!/bin/sh

echo "📦 Ejecutando postinstall: prisma generate"
npx prisma generate

echo "🚀 Ejecutando build de Next.js"
next build
