import React from 'react'
import ReactDOM from 'react-dom'
import Content from './Content'
import { QueryProvider } from './providers/QueryProvider'

const container = document.createElement('div')
document.body.prepend(container)

ReactDOM.render(<QueryProvider><Content /></QueryProvider>, container)
