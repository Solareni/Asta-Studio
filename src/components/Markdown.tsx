import "katex/dist/katex.min.css";

import { ChatItem } from "./types";
import { isEmpty, omit } from "lodash";
import { FC, useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
// @ts-ignore next-line
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { codeToHtml } from "shiki";

// import { useSyntaxHighlighter } from "../SyntaxHighlighterProvider";

// import CodeBlock from "./CodeBlock";
// import ImagePreview from "./ImagePreview";
// import Link from "./Link";

const Link: React.FC = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) => {
  if (props.href?.startsWith("#")) {
    return <span className="link">{props.children}</span>;
  }

  return (
    <a
      {...omit(props, "node")}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    />
  );
};

const ALLOWED_ELEMENTS =
  /<(style|p|div|span|b|i|strong|em|ul|ol|li|table|tr|td|th|thead|tbody|h[1-6]|blockquote|pre|code|br|hr|svg|path|circle|rect|line|polyline|polygon|text|g|defs|title|desc|tspan|sub|sup)/i;

interface Props {
  message: ChatItem;
}

export function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `
  $$
  ${squareBracket}
  $$
  `;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    }
  );
}

export function removeSvgEmptyLines(text: string): string {
  // 用正则表达式匹配 <svg> 标签内的内容
  const svgPattern = /(<svg[\s\S]*?<\/svg>)/g;

  return text.replace(svgPattern, (svgMatch) => {
    // 将 SVG 内容按行分割,过滤掉空行,然后重新组合
    return svgMatch
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");
  });
}

interface CodeBlockProps {
  children: string;
  className: string;
  [key: string]: any;
}

const CodeBlock: FC<CodeBlockProps> = ({ children, className }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = (match && match[1]) || "";

  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    const highlight = async () => {
      const theme = "github-dark"; // Use VSCode's current theme.

      try {
        const html = await codeToHtml(children, {
          lang: language,
          theme: theme,
        });

        setHighlightedCode(html);
      } catch (e) {
        setHighlightedCode(children);
      }
    };

    highlight();
  }, [language, children, className]);
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </div>
  );
};

const Markdown: FC<Props> = ({ message }) => {
  const { t } = useTranslation();
  const rehypeMath = rehypeKatex;

  const messageContent = useMemo(() => {
    const empty = isEmpty(message.content);
    const content = message.content;
    return removeSvgEmptyLines(escapeBrackets(content as string));
  }, [message, t]);

  const rehypePlugins = useMemo(() => {
    const hasElements = ALLOWED_ELEMENTS.test(messageContent);
    return hasElements ? [rehypeRaw, rehypeMath] : [rehypeMath];
  }, [messageContent, rehypeMath]);

  return (
    <ReactMarkdown
      className="markdown"
      rehypePlugins={rehypePlugins}
      remarkPlugins={[remarkMath, remarkGfm]}
      components={
        {
          a: Link,
          code: CodeBlock,
          // img: ImagePreview,
        } as Partial<Components>
      }
      remarkRehypeOptions={{
        footnoteLabel: "fontnots",
        footnoteLabelTagName: "h4",
        footnoteBackContent: " ",
      }}
    >
      {messageContent}
    </ReactMarkdown>
  );
};

export default Markdown;
