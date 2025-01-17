# Question

Can namespaces declaration merge?
Can anything other than interfaces and enums declaration merge?
What is declaration merging?

# Answer

```ts
// Namespaces in the same file can declaration merge

namespace MyNamespace {
  export const name = "MyNamespace";
}

namespace MyNamespace {
  export const version = "1.0.0";
}

// Usage
const name = MyNamespace.name;
const version = MyNamespace.version;
```
