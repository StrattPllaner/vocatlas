#!/bin/zsh
cd /private/tmp/claude-501/-Users-leocarreto/07e76b62-6eab-4df9-87c7-f6eb4d86f5b1/scratchpad/pw
export SP=/private/tmp/claude-501/-Users-leocarreto/07e76b62-6eab-4df9-87c7-f6eb4d86f5b1/scratchpad PLAYWRIGHT_BROWSERS_PATH=/private/tmp/claude-501/-Users-leocarreto/07e76b62-6eab-4df9-87c7-f6eb4d86f5b1/scratchpad/pwb
run(){ node audit.mjs $1 $2 /private/tmp/claude-501/-Users-leocarreto/07e76b62-6eab-4df9-87c7-f6eb4d86f5b1/scratchpad/shots/antes > out/$1-$2.log 2>&1 }
run iphone-se claro & run iphone-15 claro & run pixel-7 claro & wait
run android-360 claro & run iphone-15-pro-max claro & run ipad claro & wait
run computadora claro & run se-chromium claro & run iphone-15 oscuro & wait
run pixel-7 oscuro & run ipad oscuro & run computadora oscuro & wait
echo FIN
