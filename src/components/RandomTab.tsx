import { h } from 'preact'
import { Text } from '@create-figma-plugin/ui'

export function RandomTab() {
  return (
    <div
      style={{
        marginTop: '10px',
        height: '120px'
      }}
    >
      <Text style={{ textAlign: 'center', color: 'gray' }}>
        Random tab content coming soon...
      </Text>
    </div>
  )
}