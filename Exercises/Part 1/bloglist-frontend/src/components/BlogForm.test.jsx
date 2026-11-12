import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect } from "vitest"
import BlogsForm from "./BlogsForm"

test("<Blog /> calls the event handle correctly", async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogsForm createBlog={createBlog} />)

  const saveButton = screen.getByText("Save")

  const titleInput = screen.getByLabelText("title")
  const authorInput = screen.getByLabelText("author")
  const urlInput = screen.getByLabelText("url")

  await user.type(titleInput, "Title")
  await user.type(authorInput, "Author")
  await user.type(urlInput, "Url")

  await user.click(saveButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe("Title")
  expect(createBlog.mock.calls[0][0].author).toBe("Author")
  expect(createBlog.mock.calls[0][0].url).toBe("Url")
})
