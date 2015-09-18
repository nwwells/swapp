import React from 'react'

const StartWars = React.createClass({
  render() {
    return (
      <h1>Make me do Star Wars stuff!</h1>
    )
  }
})

React.render(<StartWars />, document.querySelector('.app'))
