import React from 'react'
import './Spinner.scss'

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner text-warning spinner-border" role="status"></div>
    </div>
  )
}

export default Spinner