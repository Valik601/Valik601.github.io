// Runs with Quarto's bundled Deno; no separate Node/Python install needed.
const root = Deno.cwd();
const out = `${root}/_site`;
function fail(message: string): never { console.error(message); Deno.exit(1); }
if (Deno.args[0] === "pre") {
  const result = new Deno.Command("git", {args:["ls-files", "-z"], stdout:"piped", stderr:"null"}).outputSync();
  if (result.success) {
    const tracked = new TextDecoder().decode(result.stdout).split("\0");
    const forbidden = tracked.filter(p => /^(posts\/(?:private|_private)\/|_site(?:-local)?\/|_freeze\/)/.test(p));
    if (forbidden.length) fail("Publish blocked: private/generated files are tracked by Git. Remove them from the index (git rm --cached), keeping local files.\n" + forbidden.join("\n"));
  }
  // Delete only the known public output folder, never source or local output.
  if (Deno.env.get("QUARTO_PROJECT_RENDER_ALL") === "1") {
    try { Deno.removeSync(out, {recursive:true}); } catch (e) { if (!(e instanceof Deno.errors.NotFound)) throw e; }
  }
} else {
  const violations: string[] = [];
  function walk(dir: string) {
    for (const e of Deno.readDirSync(dir)) {
      const path = `${dir}/${e.name}`;
      if (e.isSymlink) { violations.push(path); continue; }
      const rel = path.slice(out.length+1);
      if (/(^|\/)(private|_private|_site-local|_freeze)(\/|$)|(^|\/)private\.html$/.test(rel)) violations.push(rel);
      if (e.isDirectory) walk(path);
      else if (/\.(html|json|xml|txt|md|qmd)$/i.test(e.name)) {
        const text = Deno.readTextFileSync(path);
        if (/posts[\/\\](?:_?private)[\/\\]|(?:href|url)[^\n]{0,30}private\.html/.test(text)) violations.push(rel);
      }
    }
  }
  walk(out);
  if (violations.length) fail("Publish blocked: private paths or links found in public output.\n" + [...new Set(violations)].join("\n"));
  console.log("Public output verified: no private pages, resources, listing/search/feed links.");
}
