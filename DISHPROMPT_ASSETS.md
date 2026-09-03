# DishPrompt image replacement guide

All replaceable website images are grouped in one folder:

`/home/ubuntu/webdev-static-assets/dishprompt-assets/`

| Filename | Used for | Recommended replacement |
|---|---|---|
| `dishprompt-logo.png` | Header and footer brand mark | Transparent PNG logo, square, 512×512 or larger |
| `favicon.png` | Browser tab icon | Square PNG, 512×512 or larger |
| `og-dishprompt.jpg` | WhatsApp/social link preview | 1200×630 JPG with the product name and strongest dish visual |
| `hero-dish.jpg` | Homepage hero | Portrait JPG, ideally 4:5, one strong hero dish with clean negative space |
| `result-paneer-tikka.jpg` | Results page example 01 and homepage solution image | Portrait JPG, 4:5, real dish photo |
| `result-biryani.jpg` | Results page example 02 | Portrait JPG, 4:5, real dish photo |
| `result-masala-dosa.jpg` | Results page example 03 | Portrait JPG, 4:5, real dish photo |

Keep the exact filenames when replacing the files. The page code already points to the uploaded storage paths for the current versions. When you replace images in the project, re-upload the new files through the project’s managed asset/file workflow and keep the same semantic names.

The results page is available at `/results` and is linked from the homepage navigation and hero section. It intentionally presents the visuals as examples, not customer testimonials or performance proof.

## Image guidance

Use authentic, high-resolution images of the actual dishes. Avoid adding text inside the dish images unless you are intentionally creating the OG social preview. For Google, delivery listings and menus, keep images representative of the real portion, ingredients and presentation.
