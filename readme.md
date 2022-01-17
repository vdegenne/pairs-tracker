# lit-typescript-starter

## Install
### clone to a new project directory (appname)
```bash
git clone --depth 1 https://github.com/vdegenne/lit-typescript-starter.git appname
```
### enter the directory (Esc+. on Unix to paste the last argument, appname here)
```bash
cd appname
```
### remove the git directory
```bash
rm -rf .git
```
### Verify the deps in `package.json` (remove the `koa` deps if you only need a static app) then install the deps
```bash
npm i
```
### open the project in your fav IDE
```bash
code .
```



## Set up

- Change `%appname%` in `package.json`, `pm2.config.js` and `public/index.html`
- Watch for changes `npm run watch`

### If you don't need the server

- Start a local server (reloading the page every time the app is recompiled) with `npm run browser-sync:static`

### If you need the server (koa)

- Change the port in `server.js` and `%port%` in `package.json`
- You can use `pm2 start pm2.config.js` to start the server and watch for changes in `server.js` (the server will automatically restart)
- Use `npm run browser-sync` instead of `browser-sync:static`
