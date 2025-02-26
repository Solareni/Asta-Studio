import 'katex/dist/katex.min.css'

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
  const { codeToHtml } = useSyntaxHighlighter();

  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] ?? "text";
  const [html, setHtml] = useState<string>("");
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const codeContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHighlightedCode = async () => {
      const highlightedHtml = await codeToHtml(children, language);
      setHtml(highlightedHtml);
    };
    loadHighlightedCode();
  }, [children, language]);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (codeContentRef.current) {
      const height = codeContentRef.current.scrollHeight;
      setShouldShowExpandButton(height > 200); // Set threshold as needed
    }
  }, [html]);

  return (
    <div className="relative rounded-md bg-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-200 text-gray-700">
        <span className="text-sm font-medium">{language}</span>
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-300"
          onClick={() => {
            navigator.clipboard.writeText(children);
          }}
        >
          Copy
        </button>
      </div>
      <div
        ref={codeContentRef}
        className={`code-content transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-full" : "max-h-48"
        }`}
      >
        <pre className="p-4">
          <code
            dangerouslySetInnerHTML={{ __html: html }}
            className={`hljs language-${language}`}
          />
        </pre>
      </div>
      {shouldShowExpandButton && (
        <button
          className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

const Markdown: FC<Props> = ({ message }) => {
  const { t } = useTranslation();
  const rehypeMath = rehypeKatex;

  const messageContent = useMemo(() => {
    const empty = isEmpty(message.content);
    const paused = message.status === "paused";
    const content = message.content;
    return removeSvgEmptyLines(escapeBrackets(content));
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
        //   code: CodeBlock,
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
