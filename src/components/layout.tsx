import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useDispatch } from 'react-redux';
import { axiosInstance } from '@/lib/axios';
import { getTokens } from '@/redux/features/accessTokenSlice';

const Layout = () => {
  const dispatch = useDispatch()


  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axiosInstance.get('/store')
        const shopifyAccessToken = response.data.store.accessToken
        const shippoApiKey = response.data.store.shippoApiKey

        dispatch(getTokens({ shippoApiKey, shopifyAccessToken }))
      } catch (error) {
        console.log(error)
      }
    }

    getToken()
  }, [])

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="min-w-0 flex-1 overflow-y-auto pt-0">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-border/70 bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <span className="truncate text-sm font-semibold text-(--text-h)">
            App name
          </span>
        </header>
        <div className="w-full min-w-0 flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout