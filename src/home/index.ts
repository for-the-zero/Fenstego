import $ from 'jquery';
//
import 'mdui/components/card.js';
import 'mdui/components/button.js';

//
import { init_i18n } from '../global/i18n';
import config_static_home from '../../configs/home.static.yaml';
init_i18n(config_static_home);

//
const e_tops_card1 = $('.tops > mdui-card:nth-child(1)');
const e_tops_card2 = $('.tops > mdui-card:nth-child(2)');
const e_bottoms_card1 = $('.bottoms > mdui-card:nth-child(1)');
const bc1_btn1_width = $('.bottoms > mdui-card:nth-child(1) > mdui-button:nth-child(1)').width() as number;
const bc1_btn2_width = $('.bottoms > mdui-card:nth-child(1) > mdui-button:nth-child(2)').width() as number;
const bc1_btn3_width = $('.bottoms > mdui-card:nth-child(1) > mdui-button:nth-child(3)').width() as number;
function set_tops_min_width(){
    const card2_width = e_tops_card2[0].offsetWidth;
    e_tops_card1.css('--tops-min-width', card2_width + 'px');
};
function check_bottoms_overflow(){
    if(50 + bc1_btn1_width + bc1_btn2_width + bc1_btn3_width <= window.innerWidth){
        e_bottoms_card1.removeClass('v-box').addClass('h-box');
    } else {
        e_bottoms_card1.removeClass('h-box').addClass('v-box');
    };
};
set_tops_min_width();
check_bottoms_overflow();
window.addEventListener('resize', () => {
    set_tops_min_width();
    check_bottoms_overflow();
});
