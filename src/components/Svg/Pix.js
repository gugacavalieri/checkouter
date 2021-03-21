/* eslint-disable max-len */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Pix extends PureComponent { //eslint-disable-line
  render () {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
        viewBox={`0 0 ${this.props.viewBox[0]} ${this.props.viewBox[1]}`}
      >
        <defs>
          <linearGradient
            id="pix-a"
            x1="366.071%"
            x2="0%"
            y1="-146.973%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={this.props.gradient.initial}
            />
            <stop
              offset="100%"
              stopColor={this.props.gradient.final}
            />
          </linearGradient>
        </defs>
        <g fill={this.props.fill}>
          <path
            fill="url(#pix-a)"
            d="M509.733 501.246c-22.394 0-43.454-8.72-59.287-24.547l-85.608-85.605c-6.008-6.027-16.485-6.008-22.493 0l-85.92 85.919c-15.835 15.825-36.895 24.544-59.29 24.544h-16.868l108.42 108.423c33.862 33.86 88.763 33.86 122.625 0l108.734-108.734zM197.136 198.44c22.394 0 43.454 8.721 59.287 24.55l85.92 85.932c6.187 6.188 16.292 6.214 22.495-.01l85.606-85.613c15.835-15.827 36.895-24.547 59.29-24.547h10.31L411.312 90.022c-33.862-33.862-88.762-33.862-122.624 0L180.27 198.44z"
          />
          <path
            fill="url(#pix-a)"
            d="M609.98 288.69l-65.708-65.708c-1.447.58-3.012.942-4.666.942h-29.873c-15.446 0-30.565 6.263-41.478 17.183l-85.608 85.608c-8.008 8.01-18.533 12.021-29.051 12.021-10.526 0-21.044-4.01-29.054-12.013l-85.928-85.927c-10.915-10.92-26.031-17.184-41.478-17.184h-36.734c-1.565 0-3.03-.37-4.413-.89L90.02 288.69c-33.862 33.859-33.862 88.76 0 122.624l65.966 65.965c1.383-.52 2.851-.89 4.416-.89h36.734c15.447 0 30.563-6.264 41.478-17.184l85.92-85.92c15.53-15.516 42.6-15.524 58.113.01l85.608 85.597c10.913 10.923 26.032 17.186 41.478 17.186h29.873c1.656 0 3.219.36 4.668.94l65.706-65.703c33.862-33.865 33.862-88.765 0-122.624"
          />
        </g>
      </svg>

    )
  }
}

Pix.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  viewBox: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  gradient: PropTypes.shape({
    initial: PropTypes.string.isRequired,
    final: PropTypes.string.isRequired,
  }).isRequired,
}

export default Pix
