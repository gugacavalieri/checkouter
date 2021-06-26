import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import {
  always,
  either,
  equals,
  identity,
  ifElse,
  is,
  isEmpty,
  isNil,
  merge,
  path,
  pathOr,
  prop,
  values,
} from 'ramda'

import PaymentCard from '../../CardComponent'
import Dropdown from '../../former-kit/Dropdown'
import FormInput from '../../former-kit/FormInput'
import Switch from '../../former-kit/Switch'
import ThemeConsumer from '../../former-kit/ThemeConsumer'

import {
  isFormValid,
  isValidDate,
  maxLength,
  minLength,
  required,
} from '../../utils/validations'

import {
  addCreditCard,
  addPageInfo,
  updateFinalAmount,
} from '../../redux/actions'

import { NavigationBar, Form } from '../../components'

import {
  formatToBRL,
  removeMaskPlaceholder,
} from './../../utils/masks/'

const consumeTheme = ThemeConsumer('UICreditCardPage')

const defaultCreditcardInfo = {
  cardNumber: '',
  holderName: '',
  expiration: '',
  cvv: '',
}

const defaultPlaceholder = defaultValue => ifElse(
  either(equals(''), isNil),
  always(defaultValue),
  removeMaskPlaceholder
)

const defaultCvv = defaultPlaceholder('•••')
const defaultExpiration = defaultPlaceholder('MM/AA')
const defaultHolderName = defaultPlaceholder('Nome Completo')
const defaultCardNumber = defaultPlaceholder('•••• •••• •••• ••••')

const getSubtitle = (
  path([
    'paymentConfig',
    'creditcard',
    'subtitle',
  ])
)

class CreditCardPage extends Component {
  constructor (props) {
    super(props)

    const { transaction } = props

    this.state = {
      ...transaction,
      flipped: false,
      saveCart: false,
    }

    this.setTextInputRef = (element) => {
      this.firstInput = element
    }
  }

  componentDidMount () {
    const { callbacks } = this.props
    const onEnter = prop('onEnter', callbacks)

    if (onEnter) {
      onEnter()
    }

    this.firstInput.focus()
  }

  componentWillUnmount () {
    const { callbacks } = this.props
    const onExit = prop('onExit', callbacks)

    if (onExit) {
      onExit()
    }
  }

  handleChangeForm = (formValues, errors) => {
    this.setState({
      ...formValues,
      formValid: isFormValid(errors),
    })
  }

  handleInstallmentsChange = (e) => {
    const {
      handleUpdateFinalAmount,
      installments,
    } = this.props

    const selectedInstallment = e.target.value
    const installment = installments[selectedInstallment - 1]
    const finalAmount = prop('amount', installment)

    handleUpdateFinalAmount(finalAmount)
  }

  formatCreditCardForm = formValues => ({
    card_cvv: formValues.cvv,
    card_expiration_date: formValues.expiration.replace(/[^0-9]/g, ''),
    card_holder_name: formValues.holderName,
    card_number: formValues.cardNumber,
  })

  handleFormSubmit = (formValues, errors) => {
    const { saveCart } = this.state
    const {
      installments,
      handleAddCreditCard,
      handlePageTransition,
      handleSubmit,
      handlePageChange,
      transaction,
    } = this.props
    const creditcard = pathOr({}, ['paymentConfig', 'creditcard'], transaction)
    const installmentText = prop(
      'name',
      installments[formValues.installments - 1],
    )

    const method = merge(
      creditcard,
      { type: 'creditcard' },
    )

    const payment = {
      method,
      type: 'creditcard',
      info: merge(
        this.state,
        {
          installmentText,
        }
      ),
    }

    handlePageChange({
      page: 'payment',
      pageInfo: payment,
    })

    const { formValid } = isFormValid(errors)

    this.setState({ formValid })

    if (saveCart && !formValid) {
      const cardData = this.formatCreditCardForm(formValues)
      handleAddCreditCard(cardData)
      handlePageTransition('SAVE_CREDIT_CARD')()
    }

    if (!saveCart) {
      handleSubmit(formValues, errors)
    }
  }

  handleFlipCard = () => {
    this.setState(previousState => ({
      ...previousState,
      flipped: !previousState.flipped,
    }))
  }

  handleSaveCartChange = () => {
    this.setState((previousState) => {
      const newSaveCart = !previousState.saveCart
      return {
        ...previousState,
        saveCart: newSaveCart,
      }
    })
  }

  render () {
    const {
      flipped,
      cardNumber,
      holderName,
      expiration,
      cvv,
      saveCart,
    } = this.state

    const {
      allowSaveCreditCard,
      finalAmount,
      enableCart,
      handlePreviousButton,
      payment,
      theme,
      transaction,
    } = this.props

    const installments = ifElse(
      is(Array),
      identity,
      values,
    )(this.props.installments)

    const subtitle = getSubtitle(transaction)

    return (
      <Form
        data={merge(defaultCreditcardInfo, payment.info)}
        className={theme.creditcardForm}
        onChange={this.handleChangeForm}
        onSubmit={this.handleFormSubmit}
        customErrorProp="error"
        validation={{
          cardNumber: [
            required,
            minLength(16),
            maxLength(16),
          ],
          holderName: [
            required,
            maxLength(20),
          ],
          expiration: [
            required,
            isValidDate,
          ],
          cvv: [
            required,
            minLength(3),
          ],
          installments: [
            required,
          ],
        }}
      >
        <header className={theme.header}>
          <h1 className={theme.title}>Cartão de crédito</h1>
          {
            subtitle &&
            <h2 className={theme.subtitle}>{ subtitle }</h2>
          }
        </header>
        <div className={theme.content}>
          <div className={theme.paymentCardContainer}>
            <PaymentCard
              className={classNames(theme.paymentCard, {
                [theme.cardFlipped]: flipped,
              })}
              cvv={defaultCvv(cvv)}
              expiration={defaultExpiration(expiration)}
              flipped={flipped}
              holderName={defaultHolderName(holderName)}
              number={defaultCardNumber(cardNumber)}
            />
            {
              allowSaveCreditCard &&
              <React.Fragment>
                <p>Habilitar compra com 1 clique</p>
                <Switch
                  checked={saveCart}
                  onChange={this.handleSaveCartChange}
                  strings={{
                    on: 'Sim',
                    off: 'Não',
                  }}
                />
              </React.Fragment>
            }
          </div>
          <div className={theme.inputsContainer}>
            <FormInput
              label="Número do cartão"
              mask="1111 1111 1111 1111"
              name="cardNumber"
              inputRef={this.setTextInputRef}
            />
            <FormInput
              label="Nome (igual o do cartão)"
              maxLength="24"
              name="holderName"
            />
            <div className={theme.inputGroup}>
              <FormInput
                className={theme.fieldExpiration}
                label="Válido até"
                mask="11/11"
                name="expiration"
              />
              <FormInput
                className={theme.fieldCvv}
                label="Cód. segurança"
                mask="111"
                name="cvv"
                onBlur={this.handleFlipCard}
                onFocus={this.handleFlipCard}
                type="number"
              />
            </div>
            <div className={theme.dropdownContainer}>
              {
                !isEmpty(installments) &&
                <Dropdown
                  name="installments"
                  onChange={this.handleInstallmentsChange}
                  options={installments}
                  placeholder="Em quantas parcelas?"
                />
              }
            </div>
          </div>
        </div>
        <footer className={theme.footer}>
          <NavigationBar
            enableCart={enableCart}
            formValid={!this.state.formValid}
            handlePreviousButton={handlePreviousButton}
            nextTitle={`Pagar ${formatToBRL(finalAmount)}`}
            prevTitle="Ops, voltar"
          />
        </footer>
      </Form>
    )
  }
}

CreditCardPage.propTypes = {
  allowSaveCreditCard: PropTypes.bool,
  theme: PropTypes.shape({
    creditcardForm: PropTypes.string,
    content: PropTypes.string,
    footer: PropTypes.string,
    dropdownContainer: PropTypes.string,
    fieldCvv: PropTypes.string,
    fieldExpiration: PropTypes.string,
    inputGroup: PropTypes.string,
    inputsContainer: PropTypes.string,
    paymentCardContainer: PropTypes.string,
    paymentCard: PropTypes.string,
    cardFlipped: PropTypes.string,
  }),
  callbacks: PropTypes.shape({
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
  }),
  enableCart: PropTypes.bool,
  finalAmount: PropTypes.number.isRequired,
  handleAddCreditCard: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePreviousButton: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleUpdateFinalAmount: PropTypes.func.isRequired,
  handlePageTransition: PropTypes.func.isRequired,
  installments: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  payment: PropTypes.shape({
    info: PropTypes.shape({
      cardNumber: PropTypes.string,
      holderName: PropTypes.string,
      expiration: PropTypes.string,
      cvv: PropTypes.string,
    }),
  }),
  transaction: PropTypes.shape({
    amount: PropTypes.number,
    defaultMethod: PropTypes.string,
    paymentConfig: PropTypes.shape({
      creditcard: PropTypes.shape({
        installments: PropTypes.shape(),
        invoiceDescriptor: PropTypes.string,
      }),
    }),
    paymentMethods: PropTypes.arrayOf(PropTypes.array),
  }),
}

CreditCardPage.defaultProps = {
  allowSaveCreditCard: false,
  payment: {},
  callbacks: {},
  enableCart: false,
  theme: {},
  transaction: {},
}

const mapStateToProps = ({ installments, transactionValues, pageInfo }) => ({
  amount: transactionValues.amount,
  finalAmount: transactionValues.finalAmount,
  installments,
  payment: pageInfo.payment,
})

export default connect(mapStateToProps, {
  handlePageChange: addPageInfo,
  handleUpdateFinalAmount: updateFinalAmount,
  handleAddCreditCard: addCreditCard,
})(consumeTheme(CreditCardPage))
