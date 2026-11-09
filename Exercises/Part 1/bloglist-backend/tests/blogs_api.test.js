import { describe, test, after, beforeEach } from "node:test"
import assert from "node:assert"
import mongoose from "mongoose"
import supertest from "supertest"
import jwt from "jsonwebtoken"
import app from "../app.js"
import Blog from "../models/blog.js"
import User from "../models/user.js"
import helper from "./test_helper.js"

const api = supertest(app)

let tokens = []

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const users = await User.insertMany(helper.initialUsers)
  const blogs = await Blog.insertMany([
    { ...helper.initialBlogs[0], user: users[0]._id },
    { ...helper.initialBlogs[1], user: users[1]._id },
  ])

  for (const user of users) {
    user.blogs = blogs
      .filter((blog) => blog.user.equals(user._id))
      .map((blog) => blog._id)
    await user.save()
  }

  tokens = users.map((user) =>
    jwt.sign({ username: user.username, id: user._id }, process.env.SECRET),
  )
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
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    title: "Blog 3",
    author: "Author 3",
    url: "http://blog3.com",
    likes: 3,
  }

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${tokens[0]}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const blogToCheck = blogsAtEnd.find((b) => b.title === newBlog.title)
  assert(blogToCheck, "the new blog was not found in the database")
})

test("missing likes will default to zero", async () => {
  const newBlog = {
    title: "Blog 3",
    author: "Author 3",
    url: "http://blog3.com",
  }

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${tokens[0]}`)
    .send(newBlog)
    .expect(201)

  const blogsInTheDb = await helper.blogsInDb()

  const blogToCheck = blogsInTheDb.find((b) => b.title === newBlog.title)
  assert.strictEqual(blogToCheck.likes, 0)
})

test("missing title will give back 400 bad request", async () => {
  const newBlog = {
    author: "Author 3",
    url: "http://blog3.com",
    likes: 3,
  }

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${tokens[0]}`)
    .send(newBlog)
    .expect(400)

  const blogsInDbEnd = await helper.blogsInDb()
  assert.strictEqual(blogsInDbEnd.length, helper.initialBlogs.length)
})

test("missing url will give back 400 bad request", async () => {
  const newBlog = {
    title: "Blog 3",
    author: "Author 3",
    likes: 3,
  }

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${tokens[0]}`)
    .send(newBlog)
    .expect(400)

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

describe("when there is initially one user in the database", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const users = await User.insertMany(helper.initialUsers)
    const blogs = await Blog.insertMany([
      { ...helper.initialBlogs[0], user: users[0]._id },
      { ...helper.initialBlogs[1], user: users[1]._id },
    ])

    for (const user of users) {
      user.blogs = blogs
        .filter((blog) => blog.user.equals(user._id))
        .map((blog) => blog._id)
      await user.save()
    }

    tokens = helper.initialUsers.map((user) =>
      jwt.sign({ username: user.username, id: user._id }, process.env.SECRET),
    )
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "Username 3",
      name: "Name 3",
      password: "sekret",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test("password shorter than 3 characters will give back 400 bad request", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "Username 3",
      name: "Name 3",
      password: "se",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    )
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("username shorter than 3 characters will give back 400 bad request", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "Us",
      name: "Name 3",
      password: "sekret",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes("username"))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("creation fails with proper status code and message if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "Username 1",
      name: "Name 1",
      password: "sekret",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes("expected 'username' to be unique"))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  mongoose.connection.close()
})
