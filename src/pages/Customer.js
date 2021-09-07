import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  allPass,
  always,
  dissoc,
  cond,
  contains,
  isEmpty,
  merge,
  path,
  pipe,
  prop,
  propOr,
  replace,
} from 'ramda'

import ThemeConsumer from '../former-kit/ThemeConsumer'
import FormInput from '../former-kit/FormInput'

import { NavigationBar, Form } from '../components'

import {
  isCpf,
  isCnpj,
  isEmail,
  isFormValid,
  minLength,
  maxLength,
  required,
} from '../utils/validations'
import { addPageInfo } from '../redux/actions'

const consumeTheme = ThemeConsumer('UICustomerPage')

const defaultCustomerInfo = {
  documentNumber: '',
  email: '',
  name: '',
  phoneNumber: '',
}

const clean = replace(/[^0-9]/g, '')

const documentValidationsAndMasks = {
  CPF: {
    mask: '111.111.111-11',
    validation: isCpf,
  },
  CNPJ: {
    mask: '11.111.111/1111-11',
    validation: isCnpj,
  },
}

const isCNPJ = contains('CNPJ')
const cnpjConfig = {
  documentLabel: 'CNPJ',
  document: 'CNPJ',
}

const isCPF = contains('CPF')
const cpfConfig = {
  documentLabel: 'CPF',
  document: 'CPF',
}

const isCPFAndCNPJ = allPass([isCPF, isCNPJ])
const cpfAndCNPJ = {
  documentLabel: 'CPF/CNPJ',
  document: 'CPF',
}

const getAllowedDocuments = propOr(['CPF', 'CNPJ'], 'allowedDocuments')

const getDocumentConfig = pipe(
  getAllowedDocuments,
  cond([
    [isCPFAndCNPJ, always(cpfAndCNPJ)],
    [isCPF, always(cpfConfig)],
    [isCNPJ, always(cnpjConfig)],
  ])
)

class CustomerPage extends Component {
  constructor (props) {
    super(props)

    const { customer } = props

    const documentConfigs = getDocumentConfig(customer)

    this.state = {
      ...customer,
      ...documentConfigs,
    }

    this.setTextInputRef = (element) => {
      this.firstInput = element
    }
  }

  componentDidMount () {
    const { callbacks, customer } = this.props
    const onEnter = prop('onEnter', callbacks)

    if (onEnter && isEmpty(customer)) {
      onEnter()
    }

    this.firstInput.focus()
  }

  componentWillUnmount () {
    const { customer, callbacks, handlePageChange } = this.props
    const onExit = prop('onExit', callbacks)

    if (onExit && isEmpty(customer)) {
      onExit()
    }

    handlePageChange({
      page: 'customer',
      pageInfo: this.state,
    })
  }

  handleChangeForm = (values, errors) => {
    this.setState({
      ...dissoc('documentNumber', values),
      formValid: isFormValid(errors),
    })
  }

  handleFormSubmit = (values, errors) => {
    this.setState({
      formValid: isFormValid(errors),
    })

    this.props.handleSubmit(values, errors)
  }

  toggleDocumentType = () => {
    const currentDocument = this.state.document
    const document = currentDocument === 'CPF' ? 'CNPJ' : 'CPF'
    this.setState({ document })
  };

  handleDocumentNumber = (event) => {
    const value = clean(path(['target', 'value'], event))
    this.setState({
      documentNumber: value,
    })
  }

  render () {
    const {
      theme,
      customer,
      enableCart,
    } = this.props
    const {
      document,
      documentNumber,
      email,
      name,
      phoneNumber,
    } = this.state

    const { mask, validation } = documentValidationsAndMasks[document]

    const defaultCustomerData = merge(defaultCustomerInfo, customer)
    const defaulFormData = merge(
      defaultCustomerData,
      {
        document,
        documentNumber,
        email,
        name,
        phoneNumber,
      }
    )

    return (
      <Form
        data={defaulFormData}
        className={theme.customerForm}
        onChange={this.handleChangeForm}
        onSubmit={this.handleFormSubmit}
        customErrorProp="error"
        validation={{
          name: [
            required,
            maxLength(30),
          ],
          email: [
            required,
            isEmail,
            maxLength(30),
          ],
          documentNumber: [
            required,
            value => (validation(value) ? `${document} inválido` : false),
          ],
          phoneNumber: [
            required,
            minLength(10),
            maxLength(11),
          ],
        }}
      >
        <h2 className={theme.title}>
          Preencha seus dados para pagamento
        </h2>
        <div className={theme.content}>
          <FormInput
            label="Qual seu nome?"
            name="name"
            placeholder="Digite seu nome"
            inputRef={this.setTextInputRef}
          />
          <FormInput
            label="E-mail"
            name="email"
            placeholder="Digite seu e-mail"
          />
          <div className={theme.inputGroup}>
            <FormInput
              label={`${document}`}
              mask={mask}
              name="documentNumber"
              onKeyUp={this.handleDocumentNumber}
              placeholder={`Digite seu ${document}`}
            />
            {this.props.customer && this.props.customer.allowedDocuments
              && this.props.customer.allowedDocuments.includes('CNPJ') &&
              <div style={{ float: 'right', 'margin-top': '5px  ' }}>
                <input type="checkbox" onChange={this.toggleDocumentType} />CNPJ
              </div>
            }
          </div>
          <FormInput
            label="DDD + Telefone"
            mask="(11) 11111-1111"
            name="phoneNumber"
            placeholder="Digite seu telefone"
          />
        </div>
        <footer className={theme.footer}>
          <NavigationBar
            enableCart={enableCart}
            formValid={!this.state.formValid}
            nextTitle="Continuar"
          />
        </footer>
      </Form>
    )
  }
}

CustomerPage.propTypes = {
  theme: PropTypes.shape({
    title: PropTypes.string,
    customerForm: PropTypes.string,
    content: PropTypes.string,
    footer: PropTypes.string,
  }),
  customer: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    documentNumber: PropTypes.string,
    phoneNumber: PropTypes.string,
    allowedDocuments: PropTypes.array,
  }),
  callbacks: PropTypes.shape({
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
  }),
  enableCart: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
}

CustomerPage.defaultProps = {
  theme: {},
  customer: {},
  callbacks: {},
  enableCart: false,
}

const mapStateToProps = ({ pageInfo }) => ({
  customer: pageInfo.customer,
})

export default connect(mapStateToProps, {
  handlePageChange: addPageInfo,
})(consumeTheme(CustomerPage))
