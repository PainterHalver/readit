export interface Post {
  identifier: string;
  title: string;
  body?: string;
  slug: string;
  username: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  sub?: Sub;
  // virtual fields
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];
  // Virtuals
  imageUrl: string;
  bannerUrl: string;
  postCount?: number;
}

export interface Comment {
  createdAt: string;
  updatedAt: string;
  identifier: string;
  body: string;
  post: Post;
  virtualPost: Post;
  username: {
    username: string;
  };
  userVote: number;
  voteScore: number;
}
