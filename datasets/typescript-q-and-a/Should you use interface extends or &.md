# Questions

Are interfaces better than types?
Should you use interface extends or `&`?
Should you use interface extends or intersection types?
How do you improve TypeScript performance?
Are interfaces faster than types?

# Answer

When expressing object types you should use interfaces.

```ts
interface User {
  name: string;
  age: number;
}
```

This is because `interface extends` is much more powerful than `&`. `interface extends` is faster for TypeScript to process.

This speed difference can add up in large codebases. For an example, check out this article:

https://www.totaltypescript.com/react-apps-ts-performance

Measuring the speed difference is extremely complex (as is any TS performance question) so it's better not to guess and always measure your own codebase.

Note that interfaces are not necessarily faster than types - that's a common misconception. Instead, `interface extends` is faster than `&` (intersections).

Intersection types (`&`) on objects should only be used as a last resort.

```ts
type User = { name: string } & { age: number };
```

Interface extends is much better at handling inheritance. With intersection types when you have incompatible properties with the same name, they collapse into `never`:

```ts
type UserWithStringId = { id: string };

type UserWithNumberId = { id: number };

type User = UserWithStringId & UserWithNumberId;

// User is { id: never }
```

This is because intersection types are not order dependent.

Interface extends is much better, it's order dependent and will give you a compile error if you have incompatible properties with the same name.

```ts
interface UserWithStringId {
  id: string;
}

interface UserWithNumberId {
  id: number;
}

interface User
  extends UserWithStringId,
    UserWithNumberId {
  // Error: Property 'id' of type 'number' is not assignable to string
}
```
