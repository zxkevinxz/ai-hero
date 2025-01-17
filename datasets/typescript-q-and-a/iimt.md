# Question

What is a IIMT?

# Answer

IIMT stands for "Immediately Indexed Mapped Type". It's useful for turning object types into discriminated unions.

```ts
// IIMT
type User = {
  id: number;
  name: string;
  age: number;
};

// We create a mapped type...
type UnionOfUserProperties = {
  [K in keyof User]: {
    key: K;
    value: User[K];
  };
  // ...then immediately index into it
}[keyof User];

// UnionOfUserProperties is:
// {
//   key: "id";
//   value: number;
// } | {
//   key: "name";
//   value: string;
// } | {
//   key: "age";
//   value: number;
// }
```
