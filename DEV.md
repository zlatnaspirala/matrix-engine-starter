

function generateMaze(width, height) {
  const maze = [];
  for (let y = 0; y < height; y++) {
    maze[y] = [];
    for (let x = 0; x < width; x++) {
      maze[y][x] = 1; // Initially all cells are walls
    }
  }

  const visited = [];
  const stack = [];

  function carvePassage(x, y) {
    visited[y * width + x] = true;

    const neighbors = [];
    if (x > 0 && !visited[(y * width) + (x - 1)]) neighbors.push([x - 1, y]);
    if (x < width - 1 && !visited[(y * width) + (x + 1)]) neighbors.push([x + 1, y]);
    if (y > 0 && !visited[((y - 1) * width) + x]) neighbors.push([x, y - 1]);
    if (y < height - 1 && !visited[((y + 1) * width) + x]) neighbors.push([x, y + 1]);

    if (neighbors.length) {
      stack.push([x, y]);
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const dx = next[0] - x;
      const dy = next[1] - y;
      maze[y + dy][x + dx] = 0;
      carvePassage(next[0], next[1]);
    } else if (stack.length) {
      const [x, y] = stack.pop();
      carvePassage(x, y);
    }
  }

  carvePassage(0, 0);
  return maze;
}
