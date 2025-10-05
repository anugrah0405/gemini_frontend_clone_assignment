// types/next.d.ts
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

type PageProps = {
  // your page props
}

export type NextPageWithLayout<P = PageProps, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement<any>) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// Enhanced message types
export interface BaseMessage {
  id: string
  chatRoomId: string
  // timestamp may be a string (ISO) when stored/transported, or a Date when used in memory
  timestamp: string | Date
  type: 'user' | 'ai'
}

export interface TextMessage extends BaseMessage {
  content: string
  imageUrl?: never
}

export interface ImageMessage extends BaseMessage {
  content: string
  imageUrl: string
}

export type Message = TextMessage | ImageMessage

// Enhanced country type
export interface Country {
  name: {
    common: string
    official: string
  }
  idd: {
    root: string
    suffixes: string[]
  }
  flags: {
    png: string
    svg: string
  }
}