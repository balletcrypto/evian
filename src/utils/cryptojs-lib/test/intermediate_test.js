import 'babel-polyfill';
import { expect } from "chai"
import { genIntermediate } from '../Intermediate'

describe("test intermediate", async () => {
  it("test genIntermediate", async () => {
    const intermediateCode = await genIntermediate("111111")
    console.log(intermediateCode)
  })
})