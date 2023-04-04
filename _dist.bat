@echo off

terser .\src\jextend.js -c -m -o dist/jextend.min.js

terser .\src\jextend.js .\src\jextend-ext.js -c -m -o dist/jextend-ext.min.js

terser .\src\jextend.js .\src\jextend-ext.js .\src\jextend-ajax.js -c -m -o dist/jextend-full.min.js
