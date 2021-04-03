import React from 'react'
import { mount } from 'enzyme'
import PaymentCard from './'

describe('PaymentCard', () => {
  it('should mount', () => {
    const wrapper = mount(
      <PaymentCard />
    )

    expect(wrapper.text().includes('Nome Completo')).toBe(true)
  })

  it('should mount with number', () => {
    const wrapper = mount(
      <PaymentCard
        number="4111111111111111"
      />
    )

    expect(wrapper.text().includes('4111 1111 1111 1111')).toBe(true)
  })

  it('should mount with cvv', () => {
    const wrapper = mount(
      <PaymentCard
        cvv="123"
      />
    )

    expect(wrapper.text().includes('123')).toBe(true)
  })

  it('should mount with holderName', () => {
    const wrapper = mount(
      <PaymentCard
        holderName="Fulano de tal"
      />
    )

    expect(wrapper.text().includes('Fulano de tal')).toBe(true)
  })

  it('should mount with expiration', () => {
    const wrapper = mount(
      <PaymentCard
        expiration="12/19"
      />
    )

    expect(wrapper.text().includes('12/19')).toBe(true)
  })
})
