// Set SITE_URL in the build environment once the public origin is known.
const value = process.env.SITE_URL?.trim();
/** @type {string | undefined} */
let site;
if (value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTPS origin. This project uses root-relative asset paths.');
  }
  site = url.href;
}
export { site };
