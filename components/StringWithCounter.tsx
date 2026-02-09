import {Stack, Text} from '@sanity/ui'
import {StringInputProps} from 'sanity'

export function StringWithCounter(props: StringInputProps) {
  const {schemaType, value} = props
  const rules = (schemaType as any).validation?.[0]?._rules || []
  const maxRule = rules.find((r: any) => r.flag === 'max')
  const max = maxRule?.constraint

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {max != null && (
        <Text size={1} muted>
          {value?.length || 0} / {max}
        </Text>
      )}
    </Stack>
  )
}