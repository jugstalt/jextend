@echo off

terser .\src\jExt.js -c -m -o dist/jext.min.js

terser .\src\jExt.js .\src\jExt-ext.js -c -m -o dist/jext-ext.min.js

terser .\src\jExt.js .\src\jExt-ext.js .\src\jExt-ajax.js -c -m -o dist/jext-full.min.js
