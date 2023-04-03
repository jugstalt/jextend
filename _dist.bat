@echo off

terser .\src\jExt.js -c -m -o dist/jExt.min.js

terser .\src\jExt.js .\src\jExt-ext.js -c -m -o dist/jExt-ext.min.js

terser .\src\jExt.js .\src\jExt-ext.js .\src\jExt-ajax.js -c -m -o dist/jExt-full.min.js
