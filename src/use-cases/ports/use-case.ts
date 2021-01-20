export interface UseCase {
  perform (request: any): Promise<any>
}
