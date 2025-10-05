curl http://45.79.76.14:3000/library/lesson/en/2024/4/13 > current.json
echo "---
geometry: margin=2cm
documentclass: extarticle
fontsize: 17pt
output:
  pdf_document:
    latex_engine: xelatex
mainfont: Times New Roman
---" > lesson.md
node index.js  >> lesson.md
pandoc --pdf-engine=xelatex  -f markdown-implicit_figures+hard_line_breaks -t pdf lesson.md > lesson.pdf
