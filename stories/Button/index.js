import React from 'react'

import CloseIcon from 'react-icons/lib/io/android-close'
import BackIcon from 'react-icons/lib/io/android-arrow-back'

import { storiesOf } from '@storybook/react'

import Button from '../../src/components/Button'

import style from './style.css'

storiesOf('Buttons', module)
  .add('defaultTheme', () => (
    <div className={style.container}>
      <div>
        <h2>Default Button</h2>
        <Button>Label</Button>
      </div>

      <div>
        <h2>Outline</h2>
        <Button fill="outline">Label</Button>
      </div>

      <div>
        <h2>Disabled</h2>
        <Button disabled>Label</Button>
        <Button disabled relevance="low">Label</Button>
      </div>

      <div>
        <h2>Sizes</h2>
        <Button size="tiny">Tiny</Button>
        <Button size="small">Small</Button>
        <Button>Default</Button>
        <Button size="large">Large</Button>
        <Button size="extra-large">Extra-large</Button>
      </div>

      <div>
        <h2>Clean buttons for icons</h2>
        <Button fill="clean" relevance="low"><BackIcon size={30} /></Button>
        <Button fill="clean" relevance="high"><CloseIcon size={30} /></Button>
      </div>

      <div>
        <h2>Full</h2>
        <Button full>Full</Button>
      </div>

      <div>
        <h2>Text align</h2>
        <Button textAlign="center" className={style.textAlign}>Center</Button>
        <Button textAlign="left" className={style.textAlign}>Left</Button>
        <Button textAlign="right" className={style.textAlign}>Right</Button>
      </div>

      <div>
        <h2>Relevance</h2>
        <Button relevance="high">High</Button>
        <Button relevance="normal">Normal</Button>
        <Button relevance="low">Low</Button>
      </div>
    </div>
  ))