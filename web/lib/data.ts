export function loadData<T>(name: string): Promise<T> {
  return import(`@/lib/data/${name}.json`).then(m => m.default as T)
}
