const spaceCol = 120
const spaceLine = 23
const colStart = 27
const colEnd = 572

const line = (number, diff = 0, type = 'stroke') => {
  let line = type === 'stroke' ? 100 : 10
  for (let i = 0; i < number; i++) {
    line += 23
  }
  return line - diff
}

module.exports = {
  spaceCol,
  spaceLine,
  colStart,
  colEnd,
  line
}
