# Question

Can enums declaration merge?
What else can declaration merge other than interfaces?

# Answer

```ts
// Enums in the same file can declaration merge

enum Status {
  Success = "success",
  Error = "error",
}

// Declaration merging
enum Status {
  Pending = "pending",
}

// Usage
const status1 = Status.Success;
const status2 = Status.Error;
const status3 = Status.Pending;
```
