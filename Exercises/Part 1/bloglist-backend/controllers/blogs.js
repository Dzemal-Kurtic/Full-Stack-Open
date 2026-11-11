import express from "express"
import Blog from "../models/blog.js"
import middleware from "../utils/middleware.js"

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
    return response.status(404).json({ error: "blog not found" })
  }
})

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

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

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  console.log("req", request.body)

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: "blog not found" })
  }

  if (blog.user?.toString() !== request.user.id) {
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

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: "blog not found" })
    }

    const user = request.user
    if (blog.user?.toString() !== user.id) {
      return response
        .status(403)
        .json({ error: "only the creator can delete this blog" })
    }

    await blog.deleteOne()

    user.blogs = user.blogs.filter((id) => !id.equals(blog._id))
    await user.save()

    response.status(204).end()
  },
)

export default blogsRouter
