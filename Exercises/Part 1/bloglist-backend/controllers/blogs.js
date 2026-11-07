import express from "express"
import Blog from "../models/blog.js"

const blogsRouter = express.Router()

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
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
  const blog = new Blog(body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

export default blogsRouter
