# Questions

What are namespaces?
What are type only namespaces?

# Answer

```ts
// Namespaces are used to group related code

namespace MyNamespace {
  export const name = "MyNamespace";

  export const version = "1.0.0";
}

const name = MyNamespace.name;
```

```ts
// Type only namespaces are used to group related types
// They are declared using the declare keyword

declare namespace MyNamespace {
  export type Status = "success" | "error";
}

type Status = MyNamespace.Status;
```
