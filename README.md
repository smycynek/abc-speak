# ABC Speak

Copyright 2021-2026 Steven Mycynek

## Basics

This was just a fun afternoon activity I did with my daughter -- mostly to see if I could actually get it up and running in an afternoon.  I found out that using the `Audio` object repeatedly in mobile can cause iOS Chrome/Safari to suddenly stop accepting click events, so I used the `AudioContext`, which was
a bit more work, but gave better results.


## Credits

Animal drawing outlines, used with permission, by Aditi Inamdar,  <https://www.etsy.com/shop/AICreativeDesigns>

Icons by <https://www.freepik.com> from <https://www.flaticon.com>


## Usage

Built with Angular 22 (`@angular/cli`) and `bun`.

- `bun install`
- `bun run server` for a development server: <http://localhost:4200>
- `bun run build` builds for production with `--base-href /abc-speak/`, output in `dist/abc-speak/browser`
- `bun run lint` / `bun run pretty`
- `./deploy.sh prod` (or `bun run deploy`) builds and copies the app to stevenvictor.net; requires `sitevars.sh` with `SITE`, `APP`, and `FOLDER`

## Live demo

<https://stevenvictor.net/abc-speak>

version: 106
