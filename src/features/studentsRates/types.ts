export type Student = {
  Id: number
  FirstName: string | null
  SecondName: string | null
  LastName: string | null
}

export type Column = {
  Id: number
  Title: string
}

export type Rate = {
  Id: number
  Title: string
  SchoolboyId: number
  ColumnId: number
}
