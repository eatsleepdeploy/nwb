cd ../fe
echo "PREBUILD"
npm run build-for-preview
echo "POSTBUILD"
npm run deploy
echo "POSTDEPLOY"
