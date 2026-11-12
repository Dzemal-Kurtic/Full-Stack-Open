import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"
import { beforeEach, expect } from "vitest"

describe("<Blog />", () => {
  beforeEach(() => {
    const blog = {
      title: "Test title",
      author: "Test author",
      url: "Test url",
      likes: "5",
      user: {
        name: "Jemal",
      },
    }
    render(<Blog blog={blog} />)
  })

  test("at start renders title and author", async () => {
    const title = await screen.findByText("Test title", { exact: false })
    const author = await screen.findByText("Test author", { exact: false })

    expect(title).toBeDefined()
    expect(author).toBeDefined()
  })

  test("at start url and likes are not displayed", () => {
    const url = screen.queryByText("Test url")
    const likes = screen.queryByText(String(5))

    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test("after clicking 'View detail' button url and likes are displayed", async () => {
    const user = userEvent.setup()
    const button = screen.getByText("View detail")
    await user.click(button)

    const url = screen.getByText("Test url")
    const likes = screen.getByText("5", { exact: false })

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })
})

test("", async () => {
  const blog = {
    title: "Test title",
    author: "Test author",
    url: "Test url",
    likes: "5",
    user: {
      name: "Jemal",
    },
  }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const details = screen.getByText("View detail")
  await user.click(details)
  const button = screen.getByText("Like")
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
