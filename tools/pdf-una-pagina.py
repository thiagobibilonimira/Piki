"""Une las páginas del PDF largo en una sola página continua (vectorial), recortando el sobrante del final."""
import sys, fitz
src, dst = sys.argv[1], sys.argv[2]
s = fitz.open(src)
def used_bottom(p):
    y = 0
    for b in p.get_text("dict")["blocks"]:
        if b["type"] == 0: y = max(y, b["bbox"][3])
    for dr in p.get_drawings():
        if dr["rect"].height < p.rect.height * .5: y = max(y, dr["rect"].y1)
    for im in p.get_image_info():
        if im["bbox"][3] - im["bbox"][1] < p.rect.height * .5: y = max(y, im["bbox"][3])
    return min(y, p.rect.height)
W = s[0].rect.width
parts = []
for i, p in enumerate(s):
    h = used_bottom(p) + (40 if i < len(s) - 1 else 2)
    parts.append(h)
H = sum(parts); print('alto total', round(H), 'pt ->', round(H / 72 * 96), 'px')
out = fitz.open(); page = out.new_page(width=W, height=H); y = 0
for i, h in enumerate(parts):
    page.show_pdf_page(fitz.Rect(0, y, W, y + h), s, i, clip=fitz.Rect(0, 0, W, h))
    for l in s[i].get_links():  # los links no viajan con show_pdf_page: se copian corridos
        if l.get("uri") and l["from"].y0 < h:
            page.insert_link({"kind": fitz.LINK_URI, "uri": l["uri"], "from": l["from"] + (0, y, 0, y)})
    y += h
out.save(dst, garbage=3, deflate=True)
print('ok')
