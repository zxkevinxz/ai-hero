# Question

How does declaration merging work?
Can you have two interfaces with the same name?
Can you have two types with the same name?
Duplicate identifier.

# Answer

```ts
// Interfaces with the same name merge their declarations
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: "John",
  age: 30,
};
```

```ts
// Types with the same name don't merge their declarations
// In fact they show a duplicate error
type User = {
  name: string;
};

// Duplicate identifier 'User'.
type User = {
  age: number;
};
```
