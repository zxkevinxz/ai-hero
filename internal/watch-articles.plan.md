./watch-articles.ts

This script currently only works with posts. We want it to work with lessons.

In our API, post ids are prefixed with a post\_. So, post_m8cq7 is an example.
Lessons are prefixed with lesson. So, lesson_bn123 is an example.

Our watch-articles script should use the lessons API.

There is some logic in the file which converts the slug to an id. Don't worry about reusing that logic for lessons - that's posts only.

Lessons should be updated with the id of the lesson, and the body (from the markdown file).
