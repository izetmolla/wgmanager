import { ITheme } from "native-base";

/* eslint-disable no-loop-func */
// eslint-disable-next-line
import Swal from 'sweetalert2'



export function convertUnixTimestamp(unixTimestamp: number): Date {
    return new Date(unixTimestamp * 1000);
}

export function timeAgo(unixTime: number): string {
    // Convert Unix time to milliseconds
    const date = new Date(unixTime * 1000);

    // Calculate the time difference in milliseconds
    const timeDifference = new Date().getTime() - date.getTime();

    // Define the time units in milliseconds
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    // Define the time ago format based on the time difference
    let timeAgo: string;
    if (timeDifference < minute) {
        timeAgo = 'just now';
    } else if (timeDifference < hour) {
        timeAgo = Math.floor(timeDifference / minute) + 'm ago';
    } else if (timeDifference < day) {
        timeAgo = Math.floor(timeDifference / hour) + 'h ago';
    } else if (timeDifference < month) {
        timeAgo = Math.floor(timeDifference / day) + 'd ago';
    } else if (timeDifference < year) {
        timeAgo = Math.floor(timeDifference / month) + 'mo ago';
    } else {
        timeAgo = Math.floor(timeDifference / year) + 'y ago';
    }

    return timeAgo;
}

export const bytes = (bytes: any, decimals?: any, kib?: boolean, maxunit?: any): string => {
    kib = kib || false;
    if (bytes === 0) return '0 B';
    if (Number.isNaN(parseFloat(bytes)) && !Number.isFinite(bytes)) return 'NaN';
    const k = kib ? 1024 : 1000;
    const dm = decimals != null && !Number.isNaN(decimals) && decimals >= 0 ? decimals : 2;
    const sizes = kib
        ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB', 'BiB']
        : ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    if (maxunit !== undefined) {
        const index = sizes.indexOf(maxunit);
        if (index !== -1) i = index;
    }
    // eslint-disable-next-line no-restricted-properties
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}


export const Notification = Swal.mixin({
    customClass: {
        popup: 'colored-toast'
    },
    toast: true,
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    position: 'top-right'
})

export function isStringNumber(str: string): boolean {
    const pattern = /^\d+$/;
    return pattern.test(str);
}


export const getLayoutComponents = (options: any[] = [], path: string): any => {
    const op = options.filter(x => x.path === path)
    if (op.length > 0) {
        return {
            header: op[0]?.header === undefined ? true : op[0]?.header,
            footer: op[0]?.header,
            leftsidebar: op[0]?.leftsidebar,
            rightsidebar: op[0]?.leftsidebar
        }
    } else return { header: true, leftsidebar: false, rightsidebar: false, footer: true }
}

export function numbers(n: number) {
    // Create an array of n numbers
    const numbers = Array.from({ length: n }, (_, i) => i + 1);

    // Use the map method to double each number
    return numbers;
}


export const getColorFromComponent = (color_str: string, theme: ITheme): string => {
    const colors: string[] = color_str.split(".")
    if (colors.length > 1) {
        return (theme.colors as any)[colors[0]][colors[1]];
    } else {
        return (theme.colors as any)[colors[0]];
    }
}