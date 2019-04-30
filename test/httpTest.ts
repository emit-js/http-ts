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
