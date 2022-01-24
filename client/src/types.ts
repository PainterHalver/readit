export interface Post {
  identifier: string;
  title: string;
  body?: string;
  slug: string;
  username: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  // virtual fields
  url: string;
}
