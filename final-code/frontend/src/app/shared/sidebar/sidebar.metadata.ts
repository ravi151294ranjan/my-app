// Sidebar route metadata
export interface RouteInfo {
    identifier: string;
    path: string;
    title: string;
    icon: string;
    class: string;
    badge: string;
    badgeClass: string;
    isExternalLink: boolean;
    submenu: RouteInfo[];
}
