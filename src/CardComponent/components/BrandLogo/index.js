/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import brandLogos from './helpers/brandLogos'

import styles from './style.css'

const BrandLogo = ({
  brand,
  bank,
  model,
  type,
}) => {
  if (!brandLogos[brand]) {
    return null
  }

  return (
    <img
      src={brandLogos[brand]}
      alt={brand}
      className={classNames(styles[`${bank}-${model}-${type}`], styles.brandLogo)}
    />
  )
}

BrandLogo.propTypes = {
  brand: PropTypes.string,
  bank: PropTypes.string,
  model: PropTypes.string,
  type: PropTypes.string,
}

BrandLogo.defaultProps = {
  brand: '',
  bank: '',
  model: '',
  type: '',
}

export default BrandLogo
