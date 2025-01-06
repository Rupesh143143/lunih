"use client"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPosts } from "@/lib/actions/post.actions"
import {PostsType, Post} from "@/lib/types"
import {dateToLocaleString,truncateTitle} from "@/lib/utils"
import PostActionsMenu from "./PostActionsMenu"
import CardActions from "./CardActions"
import { Pagination } from "./Pagination"
import { useEffect, useState } from "react"
const ITEMS_PER_PAGE = 6
interface PostsProps {
  UserId: string | null
}
export default function PostGrid({ UserId }: PostsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [allPosts, setAllPosts] = useState<PostsType>()
  const [isLoading, setIsLoading] = useState(true)
  const totalPages = Math.ceil((allPosts?.data?.length || 0) / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPosts = allPosts?.data?.slice(startIndex, endIndex)
  
  console.log(UserId)
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getPosts() as PostsType
        setAllPosts({
          ...response,
          data: (response.data || []).map(post => ({
            ...post,
            user: {
              ...post.user,
              imageUrl: post.user.imageUrl || ''
            }
          }))
        })
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return <div>Loading posts...</div>
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold">Latest Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentPosts?.map((post: Post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
              <div className="relative h-48">
                <Image
                alt={post.title}
                className="object-cover"
                fill
                src={post.imageUrl}
                />
                {UserId === post.user.clerkUserId &&
                <PostActionsMenu postId={post.id} />
                }
              </div>
              <div className="p-4">
                <Badge className="mb-2 bg-primary-100 hover:bg-primary-200">
                {post.category}
                </Badge>
                <h3 className="mb-4 text-lg font-semibold">{truncateTitle(post.title,26)}</h3>
                <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage alt={post.user.firstName} src={post.user.imageUrl} />
                  <AvatarFallback>
                  {post.user.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{post.user.firstName} {post.user.lastName}</p>
                  <p className="text-gray-500">{dateToLocaleString(new Date(post.createdAt))}</p>
                </div>
                </div>
              </div>
              </CardContent>
              <CardFooter className="p-4 mt-auto">
              <CardActions postId={post.id}/>
              </CardFooter>
            </Card>
            ))}
        </div>
        {totalPages >= 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  )
}

