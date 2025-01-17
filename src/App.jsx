import { useState, useEffect } from 'react'
import {Routes, Route, Link, useParams, useNavigate, useLocation} from "react-router-dom"
import { useField } from './hooks/index.js'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => {
  const location = useLocation()
  const {state} = location || {}
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (state?.notification) {
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
    }, 5000)
    }
  }, [state?.notification])

  return (
  <div>
    <h2>Anecdotes</h2>
    {showNotification && <p>Anecdote got added!</p>}
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} ><Link to={`/${anecdote.id}`}>{anecdote.content}</Link></li>)}
    </ul>
  </div>
  )
}

const Anecdote = ({content}) => {
  const id = useParams().id
  const anecdote = content.find(a => a.id === Number(id))
  return (
    <>
    <h1>{anecdote.content} by {anecdote.author}</h1>
    <p>has {anecdote.votes} votes</p>
    </>
  )
  
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()


  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/', {state: {notification: true}})
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} reset={undefined}/>
        </div>
        <div>
          author
          <input {...author} reset={undefined}/>
        </div>
        <div>
          url for more info
          <input {...info} reset={undefined}/>
        </div>
        <button>create</button>
      </form>
      <button onClick={handleReset}>reset</button>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Routes>
      <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />}/>
      <Route path="/about" element={<About />} />
      <Route path="/create" element={<CreateNew addNew={addNew} />} />
      <Route path="/:id" element={<Anecdote content={anecdotes}/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
