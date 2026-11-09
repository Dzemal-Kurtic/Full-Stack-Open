import Blog from "../models/blog.js"
import User from "../models/user.js"

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

export default { initialBlogs, blogsInDb, usersInDb }
