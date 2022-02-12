export interface Post {
  _id: string
  title: string
  _createdAt: string
  author: {
    name: string
    image: string
  }
  description: string
  mainImage: {
    asset: {
      url: string
    }
  }
  slug: {
    current: string
  }
  comments: Comment[]
  body: object[]
}

export interface Comment {
  _id: string
  comment: string
  email: string
  name: string
  post: {
    _ref: string
    _type: string
  }
  _createdAt: string
  approved: boolean
  _type: string
  _rev: string
  _updatedAt: string
}
