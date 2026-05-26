interface ArticleBodyProps {
  content: string;
}

function looksLikeHtml(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (looksLikeHtml(content)) {
    return (
      <article
        className="prose prose-zinc max-w-none text-[#1a1a1a] prose-headings:font-bold prose-headings:text-[#1a1a1a] prose-p:text-zinc-700 prose-p:leading-8 prose-a:text-[#735c00] prose-strong:text-[#1a1a1a]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return (
      <article className="prose prose-zinc max-w-none text-[#1a1a1a]">
        <p className="text-base leading-8 text-zinc-700 md:text-lg md:leading-9">
          Conteúdo em breve.
        </p>
      </article>
    );
  }

  return (
    <article className="prose prose-zinc max-w-none text-[#1a1a1a]">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="mb-8 text-base leading-8 text-zinc-700 last:mb-0 md:text-lg md:leading-9"
        >
          {paragraph}
        </p>
      ))}
    </article>
  );
}
