export async function fetchData<T>(name: string): Promise<T> {
  const res = await fetch(`/api/data/${name}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function createRecord(name: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/data/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateRecord(name: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/data/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export async function deleteRecord(name: string, id: number) {
  const res = await fetch(`/api/data/${name}?id=${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete')
  return res.json()
}
