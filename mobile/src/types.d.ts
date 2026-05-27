/// <reference types="nativewind/types" />

declare module '*.css'

declare module '@expo/vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react'
  import { TextStyle, ViewStyle } from 'react-native'
  interface Props {
    name: string
    size?: number
    color?: string
    style?: TextStyle | ViewStyle
  }
  export default class MaterialCommunityIcons extends Component<Props> {}
}
