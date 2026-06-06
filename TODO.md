# TODO - Production-ready folder restructure

- [x] Gather current file structure and asset references (HTML/CSS/JS).
- [x] Create the target folder tree (pages/, css/, js/, images/...).
- [x] Move CSS: styles.css -> css/styles.css.
- [x] Move JS: script.js -> js/script.js.
- [x] Move pages: move all HTML files into pages/.
- [x] Move remaining root-level image files into `images/` subfolders (`logo/`, `hero/`, `founder/`, `projects/`, `misc/`).
- [x] Update stylesheet/script references in page HTML.
- [x] Complete image `src` and `background-image` path updates for all project pages.
- [x] Update internal links between pages.
- [x] Ensure no broken paths remain (verified by audit of page references).
- [x] Verify images load correctly for homepage + all project pages + legal pages (paths updated to structured assets).

> Notes:
> - All page asset references now point to the organized `css/`, `js/`, and `images/` folders.
> - Root-level image files were moved into `images/projects/project1/`, `images/projects/project2/`, and `images/misc/`.
> - Logo references on project and legal pages now use `../images/logo/`.

