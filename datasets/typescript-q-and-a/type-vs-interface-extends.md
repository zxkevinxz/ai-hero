# Question

How do you extend or inherit from interfaces in TypeScript?
What is the syntax for interface inheritance?
What does the extends keyword do in typescript?
What's the difference between types and interfaces?

# Answer

```ts
// Interfaces can use the extends keyword
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const animal: Animal = {
  name: "Buddy",
};

// Includes both name and breed
const dog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
};
```

```ts
// Types can't use the extend keyword
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const animal: Animal = {
  name: "Buddy",
};

// Includes both name and breed
const dog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
};
```
