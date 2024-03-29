import HiveClient from "@/lib/hiveclient"
import { Container, Flex, Heading, Text } from "@chakra-ui/react"

import { Remarkable } from "remarkable"

import type { Metadata } from "next"
import React from "react"
import { MarkdownRenderers } from "@/app/upload/MarkdownRenderers"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { transform3SpeakContent } from "@/lib/utils"

// Revalidate requests in 10 minutes
export const revalidate = 600

const hiveClient = HiveClient

export async function generateMetadata({
  params,
}: {
  params: { slug: [tag: string, user: string, postId: string] }
}): Promise<Metadata> {
  let [tag, user, postId] = params.slug
  const post = await getData(user, postId)
  const banner = JSON.parse(post.json_metadata).image

  return {
    title: post.title,
    description: `${String(post.body).slice(0, 128)}...`,
    authors: post.author,
    applicationName: "UnderHive",
    openGraph: {
      images: banner,
    },
  }
}

async function getData(user: string, postId: string) {
  const postContent = await hiveClient.database.call("get_content", [
    user.substring(3),
    postId,
  ])

  if (!postContent) throw new Error("Failed to fetch post content")

  return postContent
}


async function formatMarkdownNew(markdown: string) {
  try {
    const md = new Remarkable({ html: true, linkify: true, breaks: true })
    const body = transform3SpeakContent(markdown);
    const Sbody = md.render(body)
    console.log("Formatted markdown:", body)
    return Sbody
  } catch (error) {
    console.error("Error formatting markdown:", error)
    return ""
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (!Array.isArray(params.slug)) return
  let [tag, user, postId] = params.slug

  const post = await getData(user, postId)
  if (!post) return <Text>404 - Post not found</Text>

  const markdownPost = await formatMarkdownNew(post.body)

  return (
    <Container p={0}>
      <Heading m={6} size="md">
        {post?.title}
      </Heading>
      <ReactMarkdown
        components={MarkdownRenderers}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >{markdownPost}</ReactMarkdown>
      {/* <Text
        m={6}
        as={Flex}
        flexDir="column"
        gap={4}
        dangerouslySetInnerHTML={{ __html: markdownPost }}
        sx={{
          ul: {
            marginLeft: "20px",
            listStyleType: "disc",
          },
          li: {
            marginBottom: "4px",
          },
          a: {
            textDecor: "underline",
          },
          iframe: {
            aspectRatio: 4 / 3,
            position: "relative!important",
          },
        }}
      /> */}
    </Container>
  )
}
