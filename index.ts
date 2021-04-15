const fs = require('fs')
const fastcsv = require('fast-csv')
const neatCsv = require('neat-csv')

import { Acquisition, Object } from './types'

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

const main = async () => {
  const acquisitions: Acquisition[] = await neatCsv(
    fs.createReadStream('./sample/acquisitions.csv')
  )
  const objects: Object[] = await neatCsv(
    fs.createReadStream('./sample/objects.csv')
  )

  acquisitions.forEach((acquisition) => {
    const parent_company = objects.find((o) => o.id == acquisition.acquiring_id)
    const acquired_startup = objects.find(
      (o) => o.id == acquisition.acquisition_id
    )
    const data = {
      parent_company: parent_company.name,
      acquired_startup: acquired_startup.name,
      price: acquisition.price,
    }
    resultsCSV.push(data)

    writeResultsCSV(resultsCSV)
  })
}

main()
