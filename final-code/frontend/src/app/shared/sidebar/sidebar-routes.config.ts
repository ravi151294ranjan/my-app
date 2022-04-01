import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    // {
    //     path: '/pages/tenantchanging', title: 'SuperAdmin', icon: 'ft-home',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    {
        identifier: 'dashboard', path: 'dashboard', title: 'Dashboard', icon: 'ft-home',
        class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        identifier: 'usermanagement', path: '/users', title: 'User Management', icon: 'ft-users',
        class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    // {
    //     identifier: 'contentmanagement', path: '/content', title: 'Content Management', icon: 'ft-file-text',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },

    {
        identifier: 'contentmanagement',path: '', title: 'Content Management', icon: 'ft-align-left', class: 'has-sub',
        badge: '', badgeClass: '', 
        isExternalLink: false,
        submenu: [
            {
                identifier: 'reusablecontent',path: '/content', title: 'Reusable Content', icon: 'ft-layers', class: '',
                badge: '', badgeClass: '', isExternalLink: true, submenu: []
            },
            {
                identifier: 'contentstructure',path: '/content-structure', title: 'Content Structure', icon: 'ft-move', class: '',
                badge: '', badgeClass: '', isExternalLink: true, submenu: []
            },            
        ]
    },

    // {
    //     path: '/pages/scenario', title: 'Scenarios', icon: 'icon-pie-chart',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },

    // {
    //     path: '/pages/assetmanage', title: 'Assets', icon: 'icon-paper-clip',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    // {
    //     path: '/pages/scenemanage', title: 'Scenes', icon: 'ft-film',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    // {
    //     path: '/pages/audiomanage', title: 'Audio', icon: 'ft-speaker',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    // {
    //     path: '/pages/labmanage', title: 'Labs', icon: 'ft-monitor',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    // {
    //     path: '/pages/appmanage', title: 'App Builds', icon: 'ft-download-cloud',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    // {
    //     path: '/pages/report', title: 'Reports', icon: 'icon-bar-chart',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    // {
    //     path: '/pages/tenantmanage', title: "Tenants", icon: 'ft-list',
    //     class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    

    // {
    //     path: '', title: 'Menu Levels', icon: 'ft-align-left', class: 'has-sub',
    //     badge: '1', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', 
    //     isExternalLink: false,
    //     submenu: [
    //         {
    //             path: 'javascript:;', title: 'Second Level', icon: '', class: '',
    //             badge: '', badgeClass: '', isExternalLink: true, submenu: []
    //         },
    //         {
    //             path: '', title: 'Second Level Child', icon: '', class: 'has-sub',
    //             badge: '', badgeClass: '', isExternalLink: false,
    //             submenu: [
    //                 {
    //                     path: 'javascript:;', title: 'Third Level 1.1', icon: '',
    //                     class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: []
    //                 },
    //                 {
    //                     path: 'javascript:;', title: 'Third Level 1.2', icon: '',
    //                     class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: []
    //                 },
    //             ]
    //         },
    //     ]
    // },
    // {
    //     path: '/changelog', title: 'ChangeLog', icon: 'ft-file', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // },
    // {
    //     path: 'https://pixinvent.com/apex-angular-4-bootstrap-admin-template/documentation',
    //     title: 'Documentation', icon: 'ft-folder', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: []
    // },
    // {
    //     path: 'https://pixinvent.ticksy.com/', title: 'Support', icon: 'ft-life-buoy',
    //     class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: []
    // },

];
