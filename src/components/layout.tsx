import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useDispatch } from 'react-redux'
import { axiosInstance } from '@/lib/axios'
import { getTokens } from '@/redux/features/accessTokenSlice'
import Sidebar from './sidebar'

const Layout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axiosInstance.get('/store')
        dispatch(getTokens({ shippoApiKey: response.data.store.shippoApiKey, shopifyAccessToken: response.data.store.accessToken }))
      } catch (error) {
        console.log(error)
      }
    }
    getToken()
  }, [dispatch])

  return <SidebarProvider><Sidebar /><SidebarInset className="min-w-0 bg-muted/30"><header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:hidden"><SidebarTrigger /><span className="text-sm font-semibold">Shipflow</span></header><div className="min-h-full w-full min-w-0"><Outlet /></div></SidebarInset></SidebarProvider>
}

export default Layout
