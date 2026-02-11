// Unformatted test file for PostToolUse hook
// PostToolUse hook should auto-format this after edit
const messy = { a: 1, b: 2, c: 3 };
function test(x, y, z) {
  return x + y + z;
}
const result = test(1, 2, 3);
if (result > 5) {
  console.log("big");
} else {
  console.log("small");
}
