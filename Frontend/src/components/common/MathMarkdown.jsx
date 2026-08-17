import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

const normalizeDelimiters = (value) =>
  String(value ?? "")
    .replace(/\\\[([\s\S]*?)\\\]/g, "$$$$\n$1\n$$$$")
    .replace(/\\\((.*?)\\\)/g, "$$$1$$");

const safeLink = ({ children, ...props }) => (
  <a {...props} target="_blank" rel="noreferrer">
    {children}
  </a>
);

export default function MathMarkdown({ children, inline = false, sx }) {
  return (
    <Box
      component={inline ? "span" : "div"}
      sx={{
        lineHeight: 1.65,
        overflowWrap: "anywhere",
        "& > :first-of-type": { mt: 0 },
        "& > :last-child": { mb: 0 },
        "& p": { my: inline ? 0 : 1 },
        "& .katex-display": {
          my: 2,
          py: 0.5,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
        },
        "& .katex-display > .katex": { minWidth: "max-content" },
        "& .katex": { fontSize: "1.08em" },
        "& pre": {
          p: 2,
          overflowX: "auto",
          borderRadius: 2,
          bgcolor: "grey.100",
        },
        "& code:not(.language-math)": {
          px: 0.5,
          py: 0.2,
          borderRadius: 0.75,
          bgcolor: "grey.100",
          fontSize: "0.9em",
        },
        "& table": { width: "100%", borderCollapse: "collapse" },
        "& th, & td": { p: 1, border: 1, borderColor: "divider" },
        ...sx,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
        skipHtml
        components={
          inline
            ? { p: ({ children: content }) => <span>{content}</span>, a: safeLink }
            : { a: safeLink }
        }
      >
        {normalizeDelimiters(children)}
      </ReactMarkdown>
    </Box>
  );
}
