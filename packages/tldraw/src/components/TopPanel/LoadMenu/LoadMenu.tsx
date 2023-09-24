import * as React from 'react'
import { ToolButton } from '~components/Primitives/ToolButton'
import { styled } from '~styles'
import {
  RocketIcon,
} from '@radix-ui/react-icons'
import '@radix-ui/themes/styles.css'


export const LoadMenu = React.memo((props: any): JSX.Element => {

  return (
    <ToolButton variant="text" id="TD-Share" onClick={props.setDoodleMenuOpen}>
      View Doodles
      <OverlapIcons>
        <RocketIcon />
      </OverlapIcons>
    </ToolButton>
  )
})

const OverlapIcons = styled('div', {
  display: 'grid',
  '& > *': {
    gridColumn: 1,
    gridRow: 1,
  },
})

