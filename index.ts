const fs = require('fs')
const fastcsv = require('fast-csv')
const neatCsv = require('neat-csv')

import { Acquisition, Acquisition2, Object } from './types'

const resultsCSV: Array<{
  parent_company?: string
  acquired_startup?: string
  price?: string
}> = []

const writeResultsCSV = (csv: typeof resultsCSV) => {
  fastcsv
    .write(csv, { headers: true })
    .pipe(fs.createWriteStream('./output/acquisitions.csv')) // create `output` folder manually
}

const firstRun = async () => {
  const acquisitions: Acquisition[] = await neatCsv(
    fs.createReadStream('./sample/acquisitions.csv')
  )
  const objects: Object[] = await neatCsv(
    fs.createReadStream('./sample/objects.csv')
  )

  for (let object of objects) {
    for (let acquisition of acquisitions) {
      if (object.id === acquisition.acquiring_id) {
        const data = {
          id: acquisition.id,
          acquisition_id: acquisition.acquisition_id,
          price: acquisition.price,
          parent_company: object.name,
        }
        resultsCSV.push(data)
      }
    }
  }

  writeResultsCSV(resultsCSV)
}

const secondRun = async () => {
  const acquisitions: Acquisition2[] = await neatCsv(
    fs.createReadStream('./output/acquisitions.csv')
  )
  const objects: Object[] = await neatCsv(
    fs.createReadStream('./sample/objects.csv')
  )

  for (let object of objects) {
    for (let acquisition of acquisitions) {
      if (object.id === acquisition.acquisition_id) {
        const data = {
          parent_company: acquisition.parent_company,
          acquired_startup: object.name,
          price: acquisition.price,
        }
        resultsCSV.push(data)
      }
    }
  }

  writeResultsCSV(resultsCSV)
}

const main = () => {
  // firstRun()
  secondRun()
}

main()
