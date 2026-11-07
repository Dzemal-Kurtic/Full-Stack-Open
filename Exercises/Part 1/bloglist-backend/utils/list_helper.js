const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const num = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
  return num
}

const favoriteBlog = (blogs) => {
  let blogMostLikes = {}
  let mostLikes = 0
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > mostLikes) {
      blogMostLikes = blogs[i]
      mostLikes = blogs[i].likes
    }
  }
  return blogMostLikes
}

export { dummy, totalLikes, favoriteBlog }
