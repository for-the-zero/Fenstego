//
import 'mdui/components/navigation-drawer.js';
import '@mdui/icons/menu.js';
import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/avatar.js';
import 'mdui/components/divider.js';
import { snackbar } from 'mdui/functions/snackbar.js';
//
import '@mdui/icons/light.js';
import '@mdui/icons/translate.js';
import '@mdui/icons/wallpaper.js';
import '@mdui/icons/home.js';
import '@mdui/icons/badge.js';
import '@mdui/icons/link.js';
import '@mdui/icons/article.js';
import '@mdui/icons/train.js';
import '@mdui/icons/forum.js';
//
import $ from 'jquery';
import { get_lang, change_lang } from './i18n';
import { get_dnmode, switch_dnmode } from '../global/dn_mode';
import { change_bg_mode } from './bg';
import config_static_global from '../../configs/global.static.yaml';
const lang = get_lang();
export function init_sb(){
    const e_opener = $('.sidebar-open-btn');
    const e_sidebar = $('.sidebar');
    e_opener.on('click', () => {
        e_sidebar.prop('open',true);
    });
};
const dn_order = {'auto': 'light', 'light': 'dark', 'dark': 'auto'};
var dn_mode = get_dnmode();
const e_dn_tt = $('.glb-ctrl > mdui-tooltip:nth-child(1)');
const e_dn_btn = $('.glb-ctrl > mdui-tooltip:nth-child(1) > mdui-button-icon');
e_dn_tt.attr('content', config_static_global[lang]._other.daynight[dn_order[dn_mode]].tooltip);
e_dn_btn.on('click', ()=>{
    switch_dnmode(dn_order[dn_mode]);
    dn_mode = get_dnmode();
    e_dn_tt.attr('content', config_static_global[lang]._other.daynight[dn_order[dn_mode]].tooltip);
    snackbar({
        message: config_static_global[lang]._other.daynight[dn_mode].notice,
        autoCloseDelay: 500,
    });
});
$('.glb-ctrl > mdui-tooltip:nth-child(2)').on('click',change_lang);
$('.glb-ctrl > mdui-tooltip:nth-child(3)').on('click',change_bg_mode);
$('.glb-ctrl > mdui-tooltip:nth-child(3)').on('contextmenu',(e)=>{
    e.preventDefault();
    change_bg_mode();change_bg_mode();
});

//
import { assets_path } from './assets_path';
$('mdui-avatar').prop('src', assets_path + 'avatar.png');


//
const is_mobile = /Mobi|Android|webOS|iPhone|iPad/i.test(navigator.userAgent);
export function init_cursor(){
    if(is_mobile){return;};
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    cursor.style.display = 'none';
    cursor.style.pointerEvents = 'none';
    cursor.style.touchAction = 'none';
    document.body.appendChild(cursor);
    let clientX = 0;
    let clientY = 0;
    const syncCursor = () => {
        cursor.style.left = clientX + 'px';
        cursor.style.top  = clientY + 'px';
        cursor.style.pointerEvents = 'none'; // 不知道什么bug
    };
    document.addEventListener('mousemove', (e: MouseEvent) => {
        clientX = e.clientX;
        clientY = e.clientY;
        cursor.style.display = 'block';
        syncCursor();
    });
    document.addEventListener('scroll', () => {
        syncCursor();
    });
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-active');
    });
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-active');
    });
};