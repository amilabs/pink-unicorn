import groupDataset from './groupDataset'

self.addEventListener('message', (event) => {
  const dataset = groupDataset(event.data)
  self.postMessage({ key: event.data.key, dataset })
})
