import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPage, insertBlock } from "~/models/page.server";

import invariant from "tiny-invariant";
import { Block } from "~/components/block";

type LoaderData = {
  page: Awaited<ReturnType<typeof getPage>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);
  const page = await getPage(params.slug);
  invariant(page, `pages not found: ${params.slug}`);

  return json<LoaderData>({ page });
};

export const action = async({request}) => {
    const formData = await request.formData();

    await insertBlock(formData.get('block-id'), formData.get('contents'), formData.get('page-id'));

    return {};
}

export default function PageSlug() {
  const { page } = useLoaderData<LoaderData>();

  console.log(page);

  if (!page) {
    return (
      <main>
        <h1>Page not found</h1>
      </main>
    );
  }

  const blocks = JSON.parse(page.blockOrder);

  return (
    <main>
      <h1>{page.title}</h1>
      {blocks.map((blockId: string) => {
        return (
          <Block key={blockId} blockId={blockId} pageId={page.id}>
            {page.blocks.find((block) => block.id === blockId)?.body}
          </Block>
        );
      })}
    </main>
  );
}
