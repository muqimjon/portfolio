# muqimjon.uz

Muqimjon Mamadaliyev — .NET backend developer'ning shaxsiy portfolio sayti.
Bosh sahifa, loyihalar va aloqa bo'limlari bitta ekranda almashadi; UZ/EN til va
qorong'i/yorug' rejim almashtirgichlari bor. Bo'lim va til manzilda yashaydi:
`/`, `/work`, `/contact` (o'zbekcha) va `/en`, `/en/work`, `/en/contact`.

Butun sahifa jonli WebGL "liquid glass" shader ustida ishlaydi: panellar, tugmalar
va kursorning o'zi ham suv/shisha jismlari sifatida chiziladi.

Stack: Angular 22 (standalone, signal, zoneless), WebGL liquid-glass shader,
Cloudflare Workers static assets, GitHub Actions.

## Buyruqlar

```bash
npm start        # lokal dev server
npm run build    # production build
```

`main` branchga push qilinganda GitHub Actions avtomatik https://muqimjon.uz ga deploy qiladi.
