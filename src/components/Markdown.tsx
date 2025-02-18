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
import { useSyntaxHighlighter } from "../SyntaxHighlighterProvider";

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

	return (
		<div className="code-block">
			<div className="code-header">
				<span className="code-language">{language}</span>
			</div>
			<div
				ref={codeContentRef}
				className={`code-content ${isExpanded ? "expanded" : ""}`}
			>
				<pre>
					<code
						dangerouslySetInnerHTML={{ __html: html }}
						className={`hljs language-${language}`}
					/>
				</pre>
			</div>
			{shouldShowExpandButton && (
				<button className="expand-button" onClick={toggleExpand}>
					{isExpanded ? "Show Less" : "Show More"}
				</button>
			)}
		</div>
	);
};

const Markdown: FC<Props> = ({ message }) => {
	const { t } = useTranslation();
	const rehypeMath = rehypeMathjax;

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
					code: CodeBlock,
					// img: ImagePreview,
				} as Partial<Components>
			}
			remarkRehypeOptions={{
				footnoteLabel: t("common.footnotes"),
				footnoteLabelTagName: "h4",
				footnoteBackContent: " ",
			}}
		>
			{messageContent}
		</ReactMarkdown>
	);
};

export default Markdown;
