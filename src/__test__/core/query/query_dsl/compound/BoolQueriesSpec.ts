import {
  BoolMust, BoolMustNot, BoolShould
} from "../../../../../"

describe("BoolQueries", ()=> {

  beforeEach(()=> {
    this.testBool = (boolFn, operator)=> {
      expect(boolFn([])).toEqual({})
      expect(boolFn(["filter"])).toEqual("filter")
      expect(boolFn(["filter1", "filter2"])).toEqual({
        bool:{[operator]:["filter1", "filter2"]}
      })
    }
  })

  test("BoolMust", ()=> {
    this.testBool(BoolMust, "must")
  })
  test("BoolShould", ()=> {
    this.testBool(BoolShould, "should")
  })
  test("BoolMustNot", ()=> {
    expect(BoolMustNot([])).toEqual({})
    expect(BoolMustNot(["filter"])).toEqual({bool: {must_not: "filter"}})
    expect(BoolMustNot(["filter1", "filter2"])).toEqual({
      bool:{must_not:["filter1", "filter2"]}
    })
  })
  test("should flatten BoolMust", () => {
      const query = BoolMust([
        "filter1",
        BoolMust([ "filter2", "filter3" ]),
        "filter4",
        BoolMust(["filter5", "filter6"]),
      ])
      expect(query).toEqual({
        bool: {
          must: ["filter1", "filter2", "filter3", "filter4", "filter5", "filter6"]
        }
      })
  })
  test("should flatten BoolShould", () => {
    const query = BoolShould([
      "filter1",
      BoolShould(["filter2", "filter3"]),
      "filter4"
    ])
    expect(query).toEqual({
      bool: {
        should: ["filter1", "filter2", "filter3", "filter4"]
      }
    })
  })
  test("should not flatten BoolShould in BoolMust", () => {
    const query = BoolMust([
      "filter1",
      BoolShould(["filter2", "filter3"]),
      "filter4",
      BoolMust(["filter5", "filter6"]),
    ])
    expect(query).toEqual({
      bool: {
        must: [
          "filter1",
          {bool: {should:["filter2", "filter3"]}},
          "filter4", "filter5", "filter6"
        ]
      }
    })
  })
  test("should not flatten BoolMustNot", () => {
    const query = BoolMustNot([
      "filter1",
      BoolMustNot(["filter2", "filter3"]),
      "filter4"
    ])
    expect(query).toEqual({
      bool: {
        must_not: [
          "filter1",
          { bool: { must_not: ["filter2", "filter3"] } },
          "filter4"
        ]
      }
    })
  })

  test("should remove empty filters", () => {
    const query = BoolMust([
      {},
      "filter4"
    ])
    expect(query).toEqual( "filter4" )
  })

})
