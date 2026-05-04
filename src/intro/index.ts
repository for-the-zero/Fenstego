import $ from 'jquery';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
import 'mdui/components/divider.js';
import 'mdui/components/fab.js';
import 'mdui/components/chip.js';
import 'mdui/components/list-item.js';
import 'mdui/components/collapse.js'
import 'mdui/components/collapse-item.js';
import 'mdui/components/linear-progress.js';
// icons
import '@mdui/icons/shuffle.js';
import '@mdui/icons/history.js';
import '@mdui/icons/battery-0-bar.js';
import '@mdui/icons/battery-charging-full.js';
import '@mdui/icons/memory.js';
import '@mdui/icons/update.js';
import '@mdui/icons/location-on--outlined.js';
import '@mdui/icons/wc.js';
import '@mdui/icons/cake--outlined.js';
import '@mdui/icons/favorite-border.js';
import '@mdui/icons/more-horiz.js';

//
import { init_i18n, get_lang } from '../global/i18n';
import config_static_intro from '../../configs/intro.static.yaml';
init_i18n(config_static_intro);
const lang = get_lang();

//
import config_intro_all from '../../configs/intro.yaml';
const config_intro = config_intro_all[lang] as intro;

//
$('.basic-info > div:nth-child(1) > h1').html(config_intro.name);
$('.basic-info > div:nth-child(1) > :nth-child(3)').html(config_intro.aka);
$('.basic-info > div:nth-child(1) > :nth-child(5)').html(config_intro.identity);
$('.basic-info > div:nth-child(2) > h2').html(config_intro.bio);
$('.bi-lns:nth-child(1) > p').html(config_intro.sex);
$('.bi-lns:nth-child(2) > p').html(config_intro.birth);
$('.bi-lns:nth-child(3) > p').html(config_intro.hobby);
$('.bi-lns:nth-child(4) > p').html(config_intro.location);
$('.bi-lns:nth-child(5) > p').html(config_intro.more);

//
const e_intros_p = $('.intros p');
const e_intros_loading = $('.intros mdui-linear-progress');
const e_intros_fab = $('.intros mdui-fab');
const e_sens = $('.sens');
const e_sens_loading = $('.sens mdui-linear-progress');
const e_sens_p = $('.sens p');
const e_sens_fab = $('.sens mdui-fab');
const e_sens_h6 = $('.sens h6');

function show_intros(skip=false){
    is_intro_in_cd = true;
    e_intros_fab.prop('disabled', true);
    e_intros_p.hide();
    e_intros_loading.show();
    setTimeout(()=>{ 
        let intros = config_intro.detail_intros;
        let random_intros = intros[Math.floor(Math.random() * intros.length)];
        if(random_intros === e_intros_p.text()){
            show_intros(true);
            return;
        };
        e_intros_p.text(random_intros);
        if(/[\n\r]/.test(random_intros)){
            e_intros_p.css('text-align', 'left')
        } else {
            e_intros_p.css('text-align', 'center')
        };
        is_intro_in_cd = false;
        e_intros_fab.prop('disabled', false);
        e_intros_p.show();
        e_intros_loading.hide();
    }, skip ? 1 : (typeof config_intro.intros_wait === 'number' ? config_intro.intros_wait : eval(config_intro.intros_wait)));
};
function show_sens(skip=false){
    if(config_intro.sentences){
        let probablity = 0;
        if(config_intro.hitokoto){
            probablity = config_intro.hitokoto;
        };
        is_sens_in_cd = true;
        e_sens_fab.prop('disabled', true);
        e_sens_p.hide();
        e_sens_h6.hide();
        e_sens_loading.show();
        if(Math.random() < probablity){
            function after_action(){
                if(is_ready[0] === false || is_ready[1] === false){return;};
                is_sens_in_cd = false;
                e_sens_fab.prop('disabled', false);
                e_sens_p.show();
                e_sens_h6.show();
                e_sens_loading.hide();
            };
            var is_ready = [false, false];
            e_sens_h6.text('');
            fetch('https://v1.hitokoto.cn/').then((response: Response) => {
                response.json().then((data: any)=>{
                    let hitokoto = data.hitokoto;
                    let id = data.id;
                    let from = data.from + (data.from_who ? ', ' + data.from_who: '');
                    e_sens_p.text(hitokoto);
                    e_sens_h6.text(`From ${from} via Hitokoto (ID: ${id})`);
                    is_ready[0] = true;
                    after_action();
                }).catch((error: any)=>{
                    console.error(error);
                    e_sens_p.text(error.message);
                    e_sens_fab.prop('disabled', false);
                    is_ready = [true, true];
                    after_action();
                });
            });
            setTimeout(()=>{
                is_ready[1] = true;
                after_action();
            }, skip ? true : typeof config_intro.sentence_wait === 'number' ? config_intro.sentence_wait : eval(config_intro.sentence_wait));
        } else {
            let sens = config_intro.sentences;
            setTimeout(()=>{
                let random_sens = sens[Math.floor(Math.random() * sens.length)];
                if(random_sens.text === e_sens_p.text()){
                    show_sens(true);
                    return;
                };
                e_sens_p.text(random_sens.text);
                if(random_sens.note){
                    e_sens_h6.text(random_sens.note);
                } else {
                    e_sens_h6.text('');
                };
                if(/[\n\r]/.test(random_sens.text)){
                    e_sens_p.css('text-align', 'left')
                } else {
                    e_sens_p.css('text-align', 'center')
                };
                is_sens_in_cd = false;
                e_sens_fab.prop('disabled', false);
                e_sens_p.show();
                e_sens_h6.show();
                e_sens_loading.hide();
            }, skip ? 1 : (typeof config_intro.sentence_wait === 'number' ? config_intro.sentence_wait : eval(config_intro.sentence_wait)));
        };
    } else {
        e_sens.hide();
    };
};

e_intros_loading.hide();
e_sens_loading.hide();
var is_intro_in_cd = false;
var is_sens_in_cd = false;
e_intros_fab.on('click', ()=>{if(is_intro_in_cd){return;};show_intros();});
e_sens_fab.on('click', ()=>{if(is_sens_in_cd){return;};show_sens();});
show_intros();
show_sens();

//
const e_ll_subt = $('.lifelog-subtitle');
const e_ll_cards = $('.lifelog-cards');
const e_ll_l = $('.lifelog-card-laptop');
const e_ll_p = $('.lifelog-card-phone');
const e_ll_lt = $('.lifelog-card-laptop-table');
const e_ll_pt = $('.lifelog-card-phone-table');
interface lifelog_item_laptop {
    device: 'laptop';
    time: number;
    app_title: string;
    app_exe: string;
    mem: string;
};
interface lifelog_item_phone {
    device: 'phone';
    time: number;
    app_name: string;
    app_pn: string;
    battery: number;
    is_charging: boolean;
};
type lifelog_item = lifelog_item_laptop | lifelog_item_phone;
function sort_lifelog(data: lifelog_item[]): { phone_data: lifelog_item_phone[], laptop_data: lifelog_item_laptop[] }{
    let phone_data: lifelog_item_phone[] = [];
    let laptop_data: lifelog_item_laptop[] = [];
    for(let i = 0; i < data.length; i++){
        if(data[i].device === 'phone'){
            phone_data.push(data[i] as lifelog_item_phone);
        } else if(data[i].device === 'laptop'){
            laptop_data.push(data[i] as lifelog_item_laptop);
        };
    };
    return { phone_data, laptop_data };
};
e_ll_cards.hide();
if(config_intro.lifelog){
    fetch(config_intro.lifelog.url).then((response: Response) => {
        response.json().then((data: lifelog_item[]) => {
            let { phone_data, laptop_data } = sort_lifelog(data);
            show_lifelog(phone_data, laptop_data);
            e_ll_cards.show();
            e_ll_subt.hide();
        });
    }).catch((error: any) => {
        console.error(error);
        e_ll_subt.text(error.message);
    });
} else {
    $('.lifelog-title').hide();
};
function show_lifelog(phone: lifelog_item_phone[], laptop: lifelog_item_laptop[]){
    function ts2str(ts: number): string {
        if(ts < 1e10){ts *= 1000};
        const date = new Date(ts);
        const M = String(date.getMonth() + 1).padStart(2, '0');
        const D = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${M}-${D} ${h}:${m}`;
    };

    //
    if (laptop.length === 0) {
        if (config_intro.lifelog?.laptop.when_no_records) {
            e_ll_l.find('p').text(config_intro.lifelog.laptop.when_no_records);
            e_ll_l.find('.h-box').hide();
            e_ll_l.find('mdui-collapse').hide();
        };
    } else {
        function get_app_title(app_exe: string, app_title: string): string {
            const aliases = config_intro.lifelog?.laptop.alias ?? {};
            if (Object.keys(aliases).includes(app_exe)){
                return aliases[app_exe];
            } else {
                return app_title;
            };
        };
        e_ll_l.find('p').text(get_app_title(laptop[0].app_exe, laptop[0].app_title));
        e_ll_l.find('mdui-chip:first-child span').text(laptop[0].mem);
        e_ll_l.find('mdui-chip:last-child span').text(ts2str(laptop[0].time));
        laptop.forEach((item: lifelog_item_laptop, index: number) => {
            if(index === 0){return;};
            let tbody_html = `
                <tr>
                    <td>${ts2str(item.time)}</td>
                    <td>${get_app_title(item.app_exe, item.app_title)}</td>
                    <td>${item.mem}</td>
                </tr>
            `;
            e_ll_lt.find('tbody').append(tbody_html);
        });
    };

    //
    if(phone.length === 0){
        if(config_intro.lifelog?.phone.when_no_records){
            e_ll_p.find('p').text(config_intro.lifelog.phone.when_no_records);
            e_ll_p.find('.h-box').hide();
            e_ll_p.find('mdui-collapse').hide();
        };
    } else {
        function get_app_name(app_pn: string, app_name: string): string {
            const aliases = config_intro.lifelog?.phone.alias ?? {};
            if (Object.keys(aliases).includes(app_pn)){
                return aliases[app_pn];
            } else {
                return app_name;
            };
        };
        e_ll_p.find('p').text(get_app_name(phone[0].app_pn, phone[0].app_name));
        e_ll_p.find('mdui-chip:first-child span').text(phone[0].battery + '%');
        e_ll_p.find('mdui-chip:last-child span').text(ts2str(phone[0].time));
        e_ll_p.find('mdui-chip:first-child :first-child').replaceWith(
            phone[0].is_charging ? '<mdui-icon-battery-charging-full slot="icon"></mdui-icon-battery-charging-full>' : '<mdui-icon-battery-0-bar slot="icon"></mdui-icon-battery-0-bar>'
        );
        phone.forEach((item: lifelog_item_phone, index: number) => {
            if(index === 0){return;};
            let tbody_html = `
                <tr>
                    <td>${ts2str(item.time)}</td>
                    <td>${get_app_name(item.app_pn, item.app_name)}</td>
                    <td>${item.battery}%</td>
                </tr>
            `;
            e_ll_pt.find('tbody').append(tbody_html);
        });
    };
};