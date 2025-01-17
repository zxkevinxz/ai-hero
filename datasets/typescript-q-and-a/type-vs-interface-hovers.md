# Question

What's the difference between types and interfaces?
Do types and interfaces hover differently?

# Answer

```ts
// Types and interfaces hover differently

// Hovering InterfaceUser will just show 'InterfaceUser'
interface InterfaceUser {
  age: number;
}

// Hovering TypeUser will show the contents of the type:
// { age: number; }
type TypeUser = {
  age: number;
};
```
