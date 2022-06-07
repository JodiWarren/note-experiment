import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPages } from "~/models/page.server";

type LoaderData = {
  pages: Awaited<ReturnType<typeof getPages>>;
};

export const loader = async () => {
  return json<LoaderData>({ pages: await getPages() });
};

export default function Pages() {
  const { pages } = useLoaderData<LoaderData>();

  return (
    <main>
      <h1>Pages</h1>
      {pages && (
        <ul>
          {pages.map((page) => (
            <li key={page.id}>
              <Link to={page.slug}>{page.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
