import $ from 'jquery';
import { assets_path } from './assets_path';
import { add_dn_listener } from './dn_mode';
import global_config from '../../configs/global.yaml';

$('body').prepend(`
    <div class="bg-container"> 
        <img class="bg" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" />
    </div>
`);
const ele_bg = $('.bg');
const bg = global_config.bg as global["bg"];
var dn: 'day' | 'night';
var nw: 'narrow' | 'wide' = (window.innerWidth / window.innerHeight) > 1 ? 'wide' : 'narrow';
var bg_on = bg.defaultly_on;

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
export function change_bg_mode(){
    bg_on = !bg_on;
    init_bg();
};

export function init_bg() {
    ele_bg.css('opacity', 0);
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
    src = pics[Math.floor(Math.random() * pics.length)];
    if(!src.includes('://')){
        src = `${assets_path}bg/${src}`;
    };
    ele_bg.prop('src', src);
    ele_bg.css('opacity', assets_path === './assets/' ? 1 : bg.opacity);
};

var retry = 0;
ele_bg.on('error',()=>{
    if(!bg_on){return;};
    if(retry > 3){
        bg_on = false;
    };
    retry++;
    init_bg();
});