import { Emit, EventType } from "@emit-js/emit"
import * as fetchImport from "isomorphic-unfetch"

const fetch = (
  fetchImport.default || fetchImport
) as typeof fetchImport.default

declare module "@emit-js/emit" {
  interface Emit {
    http(
      id: EventIdType,
      url: string,
      arg: HttpArg
    ): Promise<HttpReturn>
  }
}

export interface HttpArg extends RequestInit {
  error?: boolean
  full?: boolean
  store?: boolean
  text?: string
}

export type HttpReturn = string | object

export class Http {
  public async listener(
    e: EventType, url: string, arg: HttpArg = {}
  ): Promise<HttpReturn> {
    const { emit, id } = e

    const r = await fetch(url, arg)
      .catch((err): void => {
        emit.emit(["log", id], "error", err.toString())

        if (arg.error) {
          throw new Error(err)
        }
      })

    if (r) {
      const { ok, status } = r
      let body

      if (!ok) {
        const err = "Request to " +
          url +
          " failed, status code: " +
          status.toString()
        
        emit.emit(["log", id], "error", err)
        
        if (arg.error) {
          throw new Error(err)
        }
      } else if (arg.text) {
        body = await r.text()
      } else {
        body = await r.json()
      }

      body = arg.full ? { body, ok, status, url } : body

      if (arg.store && emit["set"]) {
        await emit.emit(["set", id], body)
      }

      return body
    }
  }
}

export function http(emit: Emit): void {
  const http = new Http()
  emit.any("http", http.listener.bind(http))
}
