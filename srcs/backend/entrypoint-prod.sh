#!/bin/sh
npx prisma generate
npx prisma db push
npx prisma migrate deploy
npm run build
npm run start:prod
