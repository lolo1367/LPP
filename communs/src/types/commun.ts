export type AvecId<T> = T & {id : number} ;
export type SansId<T> = Omit <T , 'id'> ;