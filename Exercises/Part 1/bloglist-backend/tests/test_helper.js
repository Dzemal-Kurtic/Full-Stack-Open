import Blog from "../models/blog.js"
import User from "../models/user.js"

const initialUsers = [
  {
    username: "Username 1",
    name: "Name 1",
    password: "sekret",
  },
  {
    username: "Username 2",
    name: "Name 2",
    password: "sekret",
  },
]

const initialBlogs = [
  {
    title: "Blog 1",
    author: "Author 1",
    url: "http://blog1.com",
    likes: 1,
  },
  {
    title: "Blog 2",
    author: "Author 2",
    url: "http://blog2.com",
    likes: 2,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return JSON.parse(JSON.stringify(blogs))
}

const usersInDb = async () => {
  const users = await User.find({})
  return JSON.parse(JSON.stringify(users))
}

export default { initialUsers, initialBlogs, blogsInDb, usersInDb }
