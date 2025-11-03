// ---Dependencies

import katex from "katex";
import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CopyButton } from "src/common/CopyButton/CopyButton";

// Componente para el mensaje en streaming: sin parseo ni highlight
export const StreamingAnswer = React.memo(function StreamingAnswer({
	text,
}: {
	text: string;
}) {
	return <pre className="StreamingAnswer">{text}</pre>;
});

export const CodeBlock = React.memo(
	function CodeBlock({ language, text }: { language: string; text: string }) {
		return (
			<>
				<SyntaxHighlighter
					language={language || "text"}
					style={atomOneDark}
					showLineNumbers={false}
					wrapLongLines
					PreTag="pre"
					CodeTag="code"
				>
					{text}
				</SyntaxHighlighter>
				<CopyButton toCopy={text} />
			</>
		);
	},
	(prev, next) => prev.language === next.language && prev.text === next.text,
);

export const LatexBlock = React.memo(function LatexBlock({
	text,
}: {
	text: string;
}) {
	const html = katex.renderToString(text, {
		throwOnError: false,
		displayMode: true,
	});
	return (
		<>
			<div
				className={"LatexBlock"}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			<CopyButton toCopy={text} />
		</>
	);
});

export function MarkdownBlock({ text }: { text: string }) {
	return (
		<ReactMarkdown
			// --- plugins ---
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeKatex]} // + rehypeRaw, rehypeSanitize si lo deseas
		>
			{text}
		</ReactMarkdown>
	);
}
