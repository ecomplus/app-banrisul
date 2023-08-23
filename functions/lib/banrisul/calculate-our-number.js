const mod10 = (number) => {
  const stringNumber = (`${number}`.padStart(8, '0'))
    .split('')
    .map(sNumber => {
      return parseInt(sNumber, 10)
    })
  let mod10 = 0
  let isWeight1 = false
  for (let i = stringNumber.length - 1; i >= 0; i--) {
    let result = stringNumber[i] * (isWeight1 ? 1 : 2)
    if (result > 9) {
      result -= 9
    }
    mod10 += result
    isWeight1 = !isWeight1
  }
  return 10 - (mod10 % 10)
}

const mod11 = (number, mod10) => {
  const calcRest = (dv) => {
    const stringNumber = (`${number}${dv}`.padStart(9, '0'))
      .split('')
      .map(sNumber => {
        return parseInt(sNumber, 10)
      })
    let mod11 = 0
    let weight = 2
    for (let i = stringNumber.length - 1; i >= 0; i--) {
      const result = stringNumber[i] * weight
      mod11 += result
      weight = weight === 7 ? 2 : weight + 1
    }
    return mod11 % 11
  }
  let rest = calcRest(mod10)
  if (rest === 1) {
    rest = calcRest(mod10 === 9 ? 0 : mod10 + 1)
  }

  return 11 - rest
}

const ourNumber = (number) => {
  const dvMod10 = mod10(number)
  const dvMod11 = mod11(number, dvMod10)

  return `${number}${dvMod10}${dvMod11}`.padStart(10, '0')
}

module.exports = ourNumber
