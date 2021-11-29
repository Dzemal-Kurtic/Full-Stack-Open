import React from 'react'

const Header = ({ course }) => {
    return (
        <h1>{course.name}</h1>
    )
}

const Part = (props) => {
    return (
        <p>
            {props.part.name} {props.part.exercises}
        </p>
    )
}

const Content = ({ course }) => {
    return (
        <>
            {course.parts.map((part) =>
                <Part part={part} key={part.id} />
            )}
        </>
    )
}

const Course = ({ course }) => {
    const total = course.parts.reduce((acc, b) => {
        return acc + b.exercises
    }, 0)

    return (
        <>
            <Header course={course} />
            <Content course={course} />
            <p>total of {total} exercises </p>
        </>
    )
}

export default Course
