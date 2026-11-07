import Blog from "../models/blog.js"

const initialBlogs = [
  {
    title: "Prvi blog",
    author: "Prvi autor",
    url: "http://prviblog.com",
    likes: 5,
  },
  {
    title: "Drugi blog",
    author: "Drugi autor",
    url: "http://drugiblog.com",
    likes: 10,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

export default { initialBlogs, blogsInDb }
