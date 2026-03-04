import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Sidebar from '../sidebar/Sidebar'

const MainLayout = () => {
  return (
    // outermost wrapper also hides overflow so body doesn't shift when inner scrollbar appears
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden h-screen">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout