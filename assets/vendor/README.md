# Locally hosted third-party assets

These files are served from the same origin as `ux.snu.ac.kr` so the public site no longer executes JavaScript or loads stylesheets from third-party CDNs.

| Package | Version | Upstream source | License | Local entry point |
|---|---|---|---|---|
| Bootstrap | 4.0.0-alpha.6 | `maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6` | MIT (`bootstrap/4.0.0-alpha.6/LICENSE`) | `bootstrap/4.0.0-alpha.6/css/bootstrap.min.css`, `bootstrap/4.0.0-alpha.6/js/bootstrap.min.js` |
| Tether | 1.4.0 | `cdnjs.cloudflare.com/ajax/libs/tether/1.4.0` | MIT (`tether/1.4.0/LICENSE`) | `tether/1.4.0/js/tether.min.js` |
| Font Awesome Free | 6.5.0 | `cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0` | Icons: CC BY 4.0; fonts: SIL OFL 1.1; code: MIT (`font-awesome/6.5.0/LICENSE.txt`) | `font-awesome/6.5.0/css/all.min.css` |
| Nanum Gothic | Google Fonts asset revision v26 | `fonts.googleapis.com` / `fonts.gstatic.com` | SIL Open Font License 1.1 (`nanum-gothic/LICENSE.txt`) | `nanum-gothic/css/nanum-gothic.css` |

Bootstrap and Tether retain the exact files previously referenced by the layout. Font Awesome 4.7 was removed because Font Awesome 6.5 includes its version-4 compatibility font and CSS mappings.

The three files that previously had CDN integrity attributes were verified after download against those exact SHA-384 values:

```text
bootstrap.min.css sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ
tether.min.js     sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb
bootstrap.min.js  sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn
```
