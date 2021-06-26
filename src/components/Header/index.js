/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  equals,
  not,
} from 'ramda'
import { ProgressBar } from '..'

import ThemeConsumer from '../../former-kit/ThemeConsumer'
import BackIcon from '../../images/navigate_back.svg'
import CloseIcon from '../../images/closeX.svg'
import LockpadIcon from '../../images/lockpad.svg'

const consumeTheme = ThemeConsumer('UIHeader')

class Header extends React.Component {
  shouldComponentUpdate (nextProps) {
    const oldActiveStep = this.props.activeStep
    const newActiveStep = nextProps.activeStep

    return not(equals(oldActiveStep, newActiveStep))
  }

  render () {
    const {
      activeStep,
      handleCloseButton,
      handlePreviousButton,
      logoAlt,
      logoSrc,
      logoText,
      steps,
      theme,
    } = this.props

    return (
      <header className={theme.header}>
        <div className={theme.logoWrapper}>
          <BackIcon
            className={classNames(theme.back, {
              [theme.hidePrevButton]: (
                !handlePreviousButton || !handlePreviousButton()
              ),
            })}
            onClick={handlePreviousButton && handlePreviousButton()
              ? handlePreviousButton()
              : undefined}
          />
          {
            logoSrc
              ? <img
                className={theme.logo}
                src={logoSrc}
                alt={logoAlt}
              />
              : <div className={theme.safe}><LockpadIcon /><div>{logoText}</div></div>
          }
          <CloseIcon
            className={theme.close}
            onClick={handleCloseButton}
          />
        </div>
        <ProgressBar
          activeStep={activeStep}
          steps={steps}
        />
      </header>
    )
  }
}

Header.propTypes = {
  theme: PropTypes.shape({
    back: PropTypes.string,
    close: PropTypes.string,
    header: PropTypes.string,
    hidePrevButton: PropTypes.string,
    logo: PropTypes.string,
    logoWrapper: PropTypes.string,
  }),
  activeStep: PropTypes.string,
  handleCloseButton: PropTypes.func,
  handlePreviousButton: PropTypes.func,
  logoAlt: PropTypes.string,
  logoSrc: PropTypes.string,
  logoText: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.object),
}

Header.defaultProps = {
  theme: {},
  activeStep: '',
  handleCloseButton: null,
  handlePreviousButton: null,
  logoAlt: '',
  logoSrc: '',
  logoText: 'Finalizar Pagamento',
  steps: [],
}

export default consumeTheme(Header)
