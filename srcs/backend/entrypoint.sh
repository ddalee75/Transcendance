#!/bin/sh
npm install &&
# npx prisma db pull && npx prisma generate &&
npx prisma migrate deploy &&
npm run start:dev
