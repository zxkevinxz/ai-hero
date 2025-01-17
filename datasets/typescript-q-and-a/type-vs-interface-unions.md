# Question

Can interfaces be used to create union types in TypeScript?
What's the difference between types and interfaces for union types?
What's the difference between types and interfaces?

# Answer

```ts
// Interfaces can't represent unions

type Status = "success" | "error";

// Syntax error!
interface Response = "success" | "error";
```
