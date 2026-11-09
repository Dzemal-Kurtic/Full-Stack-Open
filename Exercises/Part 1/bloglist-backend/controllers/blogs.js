import express from "express"
import jwt from "jsonwebtoken"
import Blog from "../models/blog.js"
import User from "../models/user.js"

const getTokenFrom = (request) => {
  const authorization = request.get("Authorization")
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "")
  }
}

const blogsRouter = express.Router()

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    return response.status(404).end()
  }
})

blogsRouter.post("/", async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

// blogsRouter.put("/:id", async (request, response) => {
//   const { title, author, url, likes } = request.body

//   const blog = await Blog.findById(request.params.id)
//   if (!blog) {
//     return response.status(404).end()
//   }

//   blog.title = title
//   blog.author = author
//   blog.url = url
//   blog.likes = likes

//   const updatedBlog = await blog.save()
//   response.json(updatedBlog)
// })
blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user?.toString() !== decodedToken.id) {
    return response
      .status(403)
      .json({ error: "only the creator can update this blog" })
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

// blogsRouter.delete("/:id", async (request, response) => {
//   await Blog.findByIdAndDelete(request.params.id)
//   response.status(204).end()
// })

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user?.toString() !== decodedToken.id) {
    return response
      .status(403)
      .json({ error: "only the creator can delete this blog" })
  }

  await blog.deleteOne()

  const user = await User.findById(decodedToken.id)
  user.blogs = user.blogs.filter((id) => !id.equals(blog._id))
  await user.save()

  response.status(204).end()
})

export default blogsRouter
