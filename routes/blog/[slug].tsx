import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { join } from "$std/path/mod.ts";

interface BlogProps {
  markdown: string;
  attrs: Record<string, unknown>;
}

export const handler: Handlers<BlogProps> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug as string;
    try {
      const md = await Deno.readTextFile(
        join(Deno.cwd(), "data", "blog", `${slug}.md`),
      );

      const { attrs, body: markdown } = extract(md);
      return ctx.render({ markdown, attrs });
    } catch (err) {
      console.error(err);
      return ctx.renderNotFound();
    }
  },
};

export default function BlogPost({ data }: PageProps<BlogProps | null>) {
  if (!data) {
    return <h1>Post not found.</h1>;
  }

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <article>
        <div>{JSON.stringify(data.attrs)}</div>
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{ __html: render(data?.markdown) }}
        />
      </article>
    </>
  );
}
