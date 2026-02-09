import {Flex, Text} from '@sanity/ui'
import {NumberInputProps} from 'sanity'

export function NumberWithSuffix(props: NumberInputProps) {
  return (
    <Flex align="center" gap={2}>
      <div style={{flex: 1}}>{props.renderDefault(props)}</div>
      <Text size={2} muted weight="semibold">
        minutes
      </Text>
    </Flex>
  )
}