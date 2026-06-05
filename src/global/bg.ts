import $ from 'jquery';
import { assets_path } from './assets_path';
import { add_dn_listener } from './dn_mode';
import global_config from '../../configs/global.yaml';

$('body').prepend(`
    <div class="bg-container"${assets_path !== './assets/' ? ' style="margin-top: 4rem;"' : ''}> 
        <img class="bg" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" />
    </div>
`);
const e_bg = $('.bg');
const bg = global_config.bg as global["bg"];
var dn: 'day' | 'night';
var nw: 'narrow' | 'wide' = (window.innerWidth / window.innerHeight) > 1 ? 'wide' : 'narrow';
var bg_on = bg.defaultly_on;
var retry = 0;
var loader = new Image();

add_dn_listener((newdn: 'day' | 'night') => {
    if(dn !== newdn){
        dn = newdn;
        init_bg();
    };
});
window.addEventListener('resize',()=>{
    let now = ((window.innerWidth / window.innerHeight) > 1 ? 'wide' : 'narrow') as 'wide' | 'narrow';
    if(now != nw){
        nw = now;
        init_bg();
    };
});
if(localStorage.getItem('bg_switch')){
    bg_on = localStorage.getItem('bg_switch') == '1';
};
export function change_bg_mode(){
    bg_on = !bg_on;
    localStorage.setItem('bg_switch', bg_on ? '1' : '0');
    init_bg();
};

var prev_bg = '';
function get_bg_src(pics: string[]){
    while(true){
        if(pics.length == 1){
            return pics[0];
        };
        let pic = pics[Math.floor(Math.random() * pics.length)];
        if(pic != prev_bg){
            prev_bg = pic;
            return pic;
        };
    };
};
export function init_bg() {
    e_bg.css('opacity', 0);
    e_bg.css('filter', `blur(50px)`);
    if(!bg_on){
        return;
    };
    let src: string;
    let pics: string[] = [];
    if(dn == 'day'){
        pics = nw == 'wide' ? bg.pics.day_wide : bg.pics.day_narrow;
    } else {
        pics = nw == 'wide' ? bg.pics.night_wide : bg.pics.night_narrow;
    };
    if(!pics.length){return;};
    src = get_bg_src(pics);
    if(!src.includes('://')){
        src = `${assets_path}bg/${src}`;
    };
    loader.onload = () => {
        retry = 0;
        e_bg.prop('src', src);
        e_bg.css('opacity', assets_path === './assets/' ? 1 : bg.opacity);
        e_bg.css('filter', `blur(${assets_path === './assets/' ? '0' : bg.blur}px)`);
    };
    loader.src = src;
};

import { snackbar } from 'mdui/functions/snackbar';
loader.onerror = () => {
    if(!bg_on){return;};
    if(retry > 3){
        bg_on = false;
        snackbar({
            message: '背景图片加载失败',
            closeable: true,
        });
    };
    retry++;
    init_bg();
};