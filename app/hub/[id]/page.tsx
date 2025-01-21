import SinglePost from '@/components/shared/SinglePost'
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

async function Post({ params, searchParams }: PageProps) {
  const { id: postId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SinglePost postId={postId} />
      </Suspense>
    </div>
  );
}

export default Post;