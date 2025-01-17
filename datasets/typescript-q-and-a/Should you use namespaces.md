# Questions

Should I use namespaces?
Should I use type only namespaces?
How should I organise my types in libraries?

# Answer

I generally don't recommend runtime namespaces these days. Because they declaration merge, They can feel a bit outdated and can lead to confusing code.

Namespaces came about because TypeScript needed to come up with a module system and javascript didn't have one yet. But now we have ES modules which are a much better alternative.

They are also not supported by Node's default TypeScript runner.

Type only namespaces are a different story. You can use them to group related types. They are especially useful in libraries. Or for sharing types across a large repo or monorepo.
