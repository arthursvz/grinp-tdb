cd /app

echo "Running migrations..."
npx prisma migrate deploy
echo "Migrated!"


echo "Starting GrINP website..."
node build
echo "GrINP website started!"