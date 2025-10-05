curl http://45.79.76.14:3000/library/lesson/en/2025/1/1 > current-1.json
curl http://45.79.76.14:3000/library/lesson/ro/2025/1/1 > current-2.json
echo "---
geometry: 'margin=1cm, landscape'
documentclass: extarticle
fontsize: 14pt
output:
  pdf_document:
    latex_engine: xelatex
mainfont: Times New Roman
header-includes:
---
" > lesson.md
node index.js  >> lesson.md
#pandoc --pdf-engine=xelatex  -f markdown-implicit_figures+hard_line_breaks -t pdf lesson.md > lesson.pdf
pandoc --pdf-engine=xelatex  -f markdown-implicit_figures -t pdf lesson.md > lesson.pdf
