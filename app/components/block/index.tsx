import { Form } from "@remix-run/react";
import { useState } from "react";

interface IBlock {
    children: React.ReactNode;
    blockId: string;
    pageId: string;
}

export function Block({ children, blockId, pageId }: IBlock) {
  const [showTopForm, setShowTopForm] = useState(false);
  return (
    <div>
      {showTopForm && (
        <Form method="post" reloadDocument>
            <input type="hidden" value={pageId} name="page-id" />
            <input type="hidden" value={blockId} name="block-id" />
          <textarea name="contents" className="border-2 border-solid"></textarea>
          <button type="submit">Add</button>
        </Form>
      )}
      <button
        className="px-2 border-2"
        onClick={() => {
          setShowTopForm(true);
        }}
      >
        +
      </button>
      <p>{children}</p>
    </div>
  );
}