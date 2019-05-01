import { http } from "../"
import { Emit } from "@emit-js/emit"
import { log } from "@emit-js/log"

const url = "https://jsonplaceholder.typicode.com/todos/1"

let emit

beforeEach((): void => {
  emit = new Emit()
  log(emit)
  http(emit)
})

test("http", async (): Promise<void> => {
  const out = await emit.http(null, url)
  expect(out).toEqual(expect.any(Object))
})

test("http (full)", async (): Promise<void> => {
  const out = await emit.http(null, url, { full: true })
  expect(out.body).toEqual(expect.any(Object))
  expect(out.ok).toBe(true)
  expect(out.status).toBe(200)
  expect(out.url).toBe(url)
})

test("http error", (): Promise<void> => {
  expect.assertions(1)

  return emit
    .http(
      "todos", "http://does-not-exist", { error: true }
    )
    .catch((e): boolean => expect(true).toBe(true))
})
