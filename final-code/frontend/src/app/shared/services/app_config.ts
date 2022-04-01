/**
 * Its contain the Ipaddress. <br>
 * Its contain header for admin and super admin login.
 */
import { environment } from "environments/environment";
export class AppConfig {
    public static get App_Version(): string { return '1.0 Build 1.3'; }

    public static get IP_Address(): string { return environment.apiURL };
    public static get IP_Redirect(): string { return 'http://localhost:4200/' }

    // public static get IP_Address(): string { return 'http://0.0.0.0:3000/' }
    // public static get IP_Redirect(): string { return 'http://0.0.0.0:3000/' }

    // public static get IP_Address(): string { return 'http://admin-tool-gid-workspace.east1.ncloud.netapp.com/' };
    // public static get IP_Redirect(): string { return 'http://admin-tool-gid-workspace.east1.ncloud.netapp.com/' };


    // public static get IP_Address(): string { return 'http://192.168.1.101:3000/' };
    // public static get IP_Redirect(): string { return 'http://192.168.1.101:4200/' };

    // public static get IP_Redirect(): string { return 'https://adminpanel.sifylivewire.com:3000/' };
    // public static get IP_Address(): string { return 'https://adminpanel.sifylivewire.com:3000/' };

    // public static get IP_Redirect(): string { return 'https://adminpanel.sifylivewire.com:8082/' };
    // public static get IP_Address(): string { return 'https://adminpanel.sifylivewire.com:8082/' };


    // public static get IP_Redirect(): string { return 'https://adminpanel.sifylivewire.com:8084/' };
    // public static get IP_Address(): string { return 'https://adminpanel.sifylivewire.com:8084/' };

    // 'http://210.18.127.24:8080/'; // 'http://223.30.223.169:3000/' // 223.30.223.177 (live server) // 'http://localhost:3000/'
    public static get header_info(): any {
        return {
            key: 'x-auth-token',
            value: (JSON.parse(localStorage.loginInfonetApp).token) || ''
        }
    }
    public static get header_info_SuperAdmin(): any {
        return {
            key: 'x-auth-token',
            value: (JSON.parse(localStorage.loginInfonetApp).token) || ''
        }
    }
}
