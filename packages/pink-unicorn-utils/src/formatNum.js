/**
 * @param {number} num
 * @param {boolean} [withDecimals=false]
 * @param {number} [decimals=2]
 * @param {boolean} [cutZeroes=false]
 * @param {boolean} [forInput=false]
 */
export default function formatNum(
  num,
  withDecimals = false,
  decimals = 2,
  cutZeroes = false,
  forInput = false,
) {
  num = parseFloat(num);

  if (withDecimals) {
    num = round(num, decimals);
  }

  if (isNaN(num)) {
    num = 0;
  }

  const parts = num.toString().split('.');
  let res = forInput ? parts[0].toString() : parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const zeroCount = cutZeroes ? 2 : decimals;

  if (withDecimals && decimals) {
    if (typeof (parts[1]) !== 'undefined') {
      res += '.';
      let tail = parts[1].substring(0, decimals);
      if (tail.length < zeroCount) {
        tail = padEnd(tail, zeroCount, '0');
      }
      res += tail;
    } else {
      res += padEnd('.', parseInt(zeroCount, 10) + 1, '0');
    }
  }

  return res;
}
