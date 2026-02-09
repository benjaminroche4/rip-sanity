import {useEffect, useState} from 'react'
import {Stack, Text} from '@sanity/ui'
import {ObjectInputProps, useClient} from 'sanity'

export function createImageWithMaxSize(maxSizeKB: number) {
  return function ImageWithMaxSize(props: ObjectInputProps) {
    const client = useClient({apiVersion: '2024-01-01'})
    const [error, setError] = useState<string | null>(null)
    const value = props.value as {asset?: {_ref?: string}} | undefined
    const ref = value?.asset?._ref

    useEffect(() => {
      if (!ref) {
        setError(null)
        return
      }
      client
        .fetch(`*[_id == $id][0].size`, {id: ref})
        .then((size: number | null) => {
          if (size && size > maxSizeKB * 1024) {
            setError(`File size exceeds ${maxSizeKB} KB (${Math.round(size / 1024)} KB).`)
          } else {
            setError(null)
          }
        })
        .catch(() => setError(null))
    }, [ref, client])

    return (
      <Stack space={2}>
        {props.renderDefault(props)}
        {error && (
          <Text size={1} style={{color: 'red'}}>
            {error}
          </Text>
        )}
      </Stack>
    )
  }
}