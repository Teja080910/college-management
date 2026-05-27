import React, { createContext, useState, useContext } from 'react'

interface CrudContextType {
  refreshKey: number
  refresh: () => void
}

const CrudContext = createContext<CrudContextType>(null!)

export function CrudProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey(k => k + 1)
  return <CrudContext.Provider value={{ refreshKey, refresh }}>{children}</CrudContext.Provider>
}

export function useCrud() {
  return useContext(CrudContext)
}
