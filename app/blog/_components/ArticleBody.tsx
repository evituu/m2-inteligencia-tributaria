import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleBodyProps {
  content: string;
}

function looksLikeHtml(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function looksLikeMarkdown(content: string) {
  return /^#{1,6}\s|\*\*[\s\S]+?\*\*|^[-*]\s|^\d+\.\s|\[.+\]\(.+\)|```/m.test(content);
}

const proseClasses =
  "prose prose-zinc max-w-none break-words overflow-hidden text-[#1a1a1a] prose-headings:font-bold prose-headings:text-[#1a1a1a] prose-headings:break-words prose-p:text-zinc-700 prose-p:leading-8 prose-p:break-words prose-a:text-[#735c00] prose-strong:text-[#1a1a1a]";

export function ArticleBody({ content }: ArticleBodyProps) {
  if (looksLikeHtml(content)) {
    return (
      <article
        className={proseClasses}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (looksLikeMarkdown(content)) {
    return (
      <article className={proseClasses}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    );
  }

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return (
      <article className={proseClasses}>
        <p className="text-base leading-8 text-zinc-700 md:text-lg md:leading-9">
          Conteúdo em breve.
        </p>
      </article>
    );
  }

  return (
    <article className={proseClasses}>
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
