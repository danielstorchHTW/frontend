import esm from "./esm";

test("should know 1+1", () =>{
    let expected = 2;
    let actual = esm.add(1,1);
    expect(actual).toBe(expected);
})