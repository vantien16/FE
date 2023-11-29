
echo "Building app..."
npm run build

echo "Deploy files to server..."
scp -r -i ./ssh-key/pet build/* root@103.253.147.216:/var/www/html/
s
echo "Done!"