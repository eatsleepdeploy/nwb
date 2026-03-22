cd be
npm run start &
cd ../fe
npm run build
npm run preview -- --host --allowed-hosts nwb.darter-tone.ts.net
