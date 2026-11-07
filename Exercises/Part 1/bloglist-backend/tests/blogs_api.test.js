import { test, after, beforeEach } from "node:test"
import assert from "node:assert"
import mongoose from "mongoose"
import supertest from "supertest"
import app from "../app.js"
import Blog from "../models/blog.js"
import helper from "./test_helper.js"

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs")
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test("unique identifier returned by the api is id, not _id", async () => {
  const response = await api.get("/api/blogs")
  const blogs = response.body
  const blog = blogs[0]

  assert(Object.hasOwn(blog, "id"))
  assert(!Object.hasOwn(blog, "_id"))
})

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Treći blog",
    author: "Treći autor",
    url: "http://trećiblog.com",
    likes: 15,
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsInTheDb = await helper.blogsInDb()

  assert.strictEqual(blogsInTheDb.length, helper.initialBlogs.length + 1)

  const blogToCheck = blogsInTheDb.find((b) => b.title === "Treći blog")
  assert(blogToCheck, "the new blog was not found in the database")

  delete blogToCheck.id
  assert.deepStrictEqual(blogToCheck, newBlog)
})

test("missing likes will default to zero", async () => {
  const newBlog = {
    title: "Treći blog",
    author: "Treći autor",
    url: "http://trećiblog.com",
  }

  await api.post("/api/blogs").send(newBlog).expect(201)

  const blogsInTheDb = await helper.blogsInDb()

  const blogToCheck = blogsInTheDb.find((b) => b.title === "Treći blog")
  assert.strictEqual(blogToCheck.likes, 0)
})

test("missing title will give back 400 bad request", async () => {
  const newBlog = {
    author: "Treći autor",
    url: "http://trećiblog.com",
    likes: 15,
  }

  await api.post("/api/blogs").send(newBlog).expect(400)

  const blogsInDbEnd = await helper.blogsInDb()
  assert.strictEqual(blogsInDbEnd.length, helper.initialBlogs.length)
})

test("missing url will give back 400 bad request", async () => {
  const newBlog = {
    title: "Treći blog",
    author: "Treći autor",
    likes: 15,
  }

  await api.post("/api/blogs").send(newBlog).expect(400)

  const blogsInDbEnd = await helper.blogsInDb()
  assert.strictEqual(blogsInDbEnd.length, helper.initialBlogs.length)
})

test("deletion of a blog succeeds with status code 204 if id is valid", async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const ids = blogsAtEnd.map((b) => b.id)

  assert(!ids.includes(blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test("updating an existing blog gives back correct values", async () => {
  const blogToUpdate = {
    title: "updated blog",
    author: "updated author",
    url: "updated url",
    likes: 99,
  }

  const blogs = await helper.blogsInDb()
  const blog = blogs[0]

  blog.title = blogToUpdate.title
  blog.author = blogToUpdate.author
  blog.url = blogToUpdate.url
  blog.likes = blogToUpdate.likes

  const response = await api.put(`/api/blogs/${blog.id}`).send(blog).expect(200)
  const updatedBlog = response.body
  delete updatedBlog.id

  assert.deepStrictEqual(updatedBlog, blogToUpdate)
})

after(async () => {
  mongoose.connection.close()
})
