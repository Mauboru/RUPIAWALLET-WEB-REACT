@echo off

ssh root@212.85.19.3 "cd home && cd tecnomaub-granatrack && cd htdocs && cd granatrack.tecnomaub.site && git pull && npm install --force && npm run build"