export default function groupDataset ({
  group,
  end,
  start,
  dataset,
  dimensions,
}) {
  dataset = dataset || []
  const dimLen = dimensions.length
  const sampleLen = dimensions.length - 1

  for (let i = 0; i < dataset.length; i++) {
    let ds = dataset[i]
    let chunks = new Map()

    while (start < end) {
      chunks.set(start, [start].concat(Array(sampleLen).fill([])))
      start = start + group
    }

    chunks.set(end, [start].concat(Array(sampleLen).fill([])))

    ds.source = ds.source || []
    for (let j = 0, len = ds.source.length; j < len; j++) {
      const item = ds.source[j]
      let chunk
      for (const ts of chunks.keys()) {
        if (item[0] >= ts && item[0] < ts + group) {
          chunk = chunks.get(ts)
          break
        }
      }

      if (chunk) {
        chunks.set(chunk[0], [
          chunk[0],
          chunk[1] && chunk[1].concat(item[1]),
          chunk[2] && chunk[2].concat(item[2]),
          chunk[3] && chunk[3].concat(item[3]),
          chunk[4] && chunk[4].concat(item[4]),
          chunk[5] && chunk[5].concat(item[5]),
          chunk[6] && chunk[6].concat(item[6]),
          chunk[7] && chunk[7].concat(item[7]),
        ])
      }
    }

    ds.source = []
    chunks = Array.from(chunks.values())
    for (let j = 0, len = chunks.length; j < len; j++) {
      const item = chunks[j].slice(0, dimLen)
      for (let k = 0; k < dimLen; k++) {
        item[k] = sample(dimensions[k].name, item[k])
      }
      ds.source.push(item)
    }
  }

  return dataset
}

function sample (dim, value) {
  switch (dim) {
    case 'count':
    case 'slow_count':
      return sampleSum(value)
    case 'skip':
      return sampleSumNull(value)
    case 'max':
    case 'max95':
      return sampleMax(value)
    case 'avg':
      return sampleAverage(value)
    default:
      return value
  }
}


function sampleAverage (frame) {
  var sum = 0;
  var count = 0;
  for (var i = 0; i < frame.length; i++) {
    if (!isNaN(frame[i])) {
      sum += frame[i] || 0;
      count++;
    }
  }
  return count === 0 ? NaN : sum / count;
}

function sampleSum (frame) {
  var sum = 0;
  for (var i = 0; i < frame.length; i++) {
    sum += frame[i] || 0;
  }
  return sum;
}

function sampleSumNull (frame) {
  var sum = 0;
  for (var i = 0; i < frame.length; i++) {
    sum += frame[i] || 0;
  }
  return sum || null;
}

function sampleMax (frame) {
  var max = -Infinity;
  for (var i = 0; i < frame.length; i++) {
    if (!isNaN(frame[i]) && typeof frame[i] === 'number' && frame[i] > max) {
      max = frame[i]
    }
  }
  return isFinite(max) ? max : NaN
}
