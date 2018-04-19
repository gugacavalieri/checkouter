/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { storiesOf } from '@storybook/react'

import { Switch } from 'former-kit'

class SwitchState extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.checked,
    }
  }

  render () {
    return (
      <Switch
        checked={this.state.value}
        disabled={this.props.disabled}
        onChange={value => this.setState({ value })}
        strings={{
          on: 'Sim',
          off: 'Não',
        }}
      />
    )
  }
}

SwitchState.defaultProps = {
  checked: false,
  disabled: false,
}

storiesOf('Switch', module)
  .add('Default', () => (
    <div>
      <section>
        <h2>Enabled</h2>
        <p>Checked</p>
        <SwitchState checked />
        <p>Unchecked</p>
        <SwitchState checked={false} />
      </section>
      <section>
        <h2>Disabled</h2>
        <p>Checked</p>
        <SwitchState disabled checked />
        <p>Unchecked</p>
        <SwitchState disabled checked={false} />
      </section>
    </div>
  ))
