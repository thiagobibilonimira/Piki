"""Recomprime a JPEG solo las imágenes opacas del PDF (sin máscara de transparencia) y deja intacto el resto."""
import sys, os, io, fitz
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
d = fitz.open(src)
done = set(); saved = 0
for pno in range(len(d)):
    page = d[pno]
    for im in page.get_images(full=True):
        xref, smask, w, h = im[0], im[1], im[2], im[3]
        if xref in done or smask or w * h < 200 * 200: continue
        done.add(xref)
        try:
            pix = fitz.Pixmap(d, xref)
            if pix.alpha or pix.n not in (1, 3): continue
            img = Image.frombytes('RGB' if pix.n == 3 else 'L', (pix.width, pix.height), pix.samples)
            if max(img.size) > 1800:
                k = 1800 / max(img.size); img = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
            buf = io.BytesIO(); img.save(buf, 'JPEG', quality=82, optimize=True, progressive=True)
            old = len(d.xref_stream_raw(xref))
            if buf.tell() < old * .8:
                page.replace_image(xref, stream=buf.getvalue()); saved += old - buf.tell()
        except Exception as e:
            print('skip', xref, e)
d.save(dst, garbage=1, deflate=True)
print('ahorro', saved // 1024 // 1024, 'MB ->', os.path.getsize(dst) // 1024, 'KB')
