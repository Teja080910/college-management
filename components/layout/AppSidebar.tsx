import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  Banknote,
  Calendar,
  BookOpen,
  ClipboardList,
  LogOut,
  GraduationCap,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Students', path: '/students', icon: Users },
  { label: 'Fees Status', path: '/fees', icon: Banknote },
  { label: 'Timetable', path: '/timetable', icon: Calendar },
  { label: 'Courses', path: '/courses', icon: BookOpen },
  { label: 'Test Schedule', path: '/tests', icon: ClipboardList },
]

export default function AppSidebar({ user, onLogout }: { user: { name?: string; username?: string } | null; onLogout: () => void }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="floating" className="bg-white/70 backdrop-blur-xl border border-border/40 shadow-lg shadow-primary/5">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
            <GraduationCap className="size-5" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold tracking-tight">{user?.name || 'EduPortal'}</p>
            <p className="text-[11px] text-muted-foreground">Student Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <SidebarMenuItem key={item.path} className="mb-0.5">
                    <SidebarMenuButton
                      tooltip={item.label}
                      render={<Link href={item.path} />}
                      isActive={isActive}
                      className={`group/sidebar-item transition-all duration-200 hover:!bg-primary/10 hover:!text-primary [&>svg]:hover:!text-primary ${isActive ? '!bg-primary/10 !text-primary font-medium shadow-sm [&>svg]:!text-primary' : ''}`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className={`size-3 text-muted-foreground transition-all duration-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="bg-border/40" />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">{user?.username || 'Logout'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
