import { http } from "../"
import { Emit } from "@emit-js/emit"
import { log } from "@emit-js/log"
import { store } from "@emit-js/store"

const todo = {
  completed: false,
  id: 1,
  title: "delectus aut autem",
  userId: 1
}

const url = "https://jsonplaceholder.typicode.com/todos/1"

let emit

beforeEach((): void => {
  emit = new Emit()
  http(emit)
  log(emit)
  store(emit)
})

test("http", async (): Promise<void> => {
  const out = await emit.http(null, url)
  expect(out).toEqual(todo)
})

test("http error", (): Promise<void> => {
  expect.assertions(1)
  return emit
    .http(
      "todos", "http://does-not-exist", { error: true }
    )
    .catch((e): boolean => expect(true).toBe(true))
})

test("http full", async (): Promise<void> => {
  const out = await emit.http(null, url, { full: true })
  expect(out.body).toEqual(expect.any(Object))
  expect(out.ok).toBe(true)
  expect(out.status).toBe(200)
  expect(out.url).toBe(url)
})

test("http store", async (): Promise<void> => {
  expect.assertions(1)
  await emit.http("todos", url, { store: true })
  expect(emit.get("todos")).toEqual(todo)
})

test("http text", async (): Promise<void> => {
  const out = await emit.http(null, url, { text: true })
  expect(out).toEqual(expect.any(String))
})
