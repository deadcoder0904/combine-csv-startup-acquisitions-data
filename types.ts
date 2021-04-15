export interface Acquisition {
  id: string
  acquisition_id: string
  acquiring_id: string
  price: string
}

export interface Acquisition2 {
  id: string
  acquisition_id: string
  parent_company: string
  price: string
}

export interface Object {
  id: string
  name: string
}
