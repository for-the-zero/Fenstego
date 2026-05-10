import { setTheme } from 'mdui';
import type { Theme } from 'mdui/internal/theme';

var mode = 'auto' as Theme;

export function init_dnmode(){
    setTheme('auto');
    let inls = localStorage.getItem('dn_mode');
    if(inls && ['light', 'dark', 'auto'].includes(inls)){
        mode = inls as Theme;
        setTheme(mode);
        if(mode !== 'auto'){
            dn_listener(mode === 'light' ? 'day' : 'night');
        };
    };
};
export function get_dnmode(){
    return mode;
};
export function switch_dnmode(to: any){
    mode = to;
    setTheme(mode);
    localStorage.setItem('dn_mode', mode);
    if(mode === 'auto'){
        if(!window.matchMedia('(prefers-color-scheme: dark)').matches){
            dn_listener('day');
        };
    } else {
        dn_listener(mode === 'light' ? 'day' : 'night');
    };
};

var dn_listener: (dn: 'day' | 'night')=>void = ()=>{};
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ()=>{
    if(mode === 'auto'){
        dn_listener(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');
    };
});
export function add_dn_listener(f: (dn: 'day' | 'night')=>void){
    dn_listener = f;
    f(mode === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day') : (mode === 'dark' ? 'night' : 'day'));
};