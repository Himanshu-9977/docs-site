import Image from "next/image"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { CopyButton } from "@/components/copy-button"
import { PortableTextComponents } from "@portabletext/react"

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <div className="my-8 overflow-hidden rounded-lg border">
          <Image
            src={value.asset.url || "/placeholder.svg"}
            alt={value.alt || ""}
            width={800}
            height={450}
            className="w-full object-cover"
          />
          {value.caption && (
            <div className="bg-muted p-2 text-center text-sm text-muted-foreground">{value.caption}</div>
          )}
        </div>
      )
    },
    code: ({ value }) => {
      return (
        <div className="relative my-6 overflow-hidden rounded-lg border">
          <div className="flex items-center justify-between bg-muted px-4 py-2">
            <span className="text-sm font-medium">{value.language}</span>
            <CopyButton text={value.code} />
          </div>
          <SyntaxHighlighter
            language={value.language || "text"}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              padding: "1.5rem",
            }}
          >
            {value.code}
          </SyntaxHighlighter>
        </div>
      )
    },
  },
  block: {
    h1: ({ children }) => {
      const text = children.join("")
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

      return (
        <h1 id={id} className="scroll-m-20 text-4xl font-bold tracking-tight">
          {children}
        </h1>
      )
    },
    h2: ({ children }) => {
      const text = children.join("")
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

      return (
        <h2 id={id} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12 first:mt-0">
          {children}
        </h2>
      )
    },
    h3: ({ children }) => {
      const text = children.join("")
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

      return (
        <h3 id={id} className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">
          {children}
        </h3>
      )
    },
    normal: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
    blockquote: ({ children }) => <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = value?.href && !value.href.startsWith("/") ? "noopener noreferrer" : undefined

      return (
        <a href={value?.href} rel={rel} className="font-medium text-primary underline underline-offset-4">
          {children}
        </a>
      )
    },
    code: ({ children }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{children}</code>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
    number: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  },
}
