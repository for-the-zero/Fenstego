import $ from 'jquery';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
import 'mdui/components/divider.js';
import 'mdui/components/chip.js';
import 'mdui/components/text-field.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';
import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import 'mdui/components/badge.js';
import 'mdui/components/switch.js';
// icons
import '@mdui/icons/tag.js';
import '@mdui/icons/category--outlined.js';
import '@mdui/icons/search.js';
import '@mdui/icons/access-time.js';
import '@mdui/icons/shuffle.js';
import '@mdui/icons/filter-alt--outlined.js';
import '@mdui/icons/grid-view--outlined.js';
import '@mdui/icons/list.js';

//
import { init_i18n, get_lang } from '../global/i18n';
import config_static_blog from '../../configs/blog.static.yaml';
init_i18n(config_static_blog);
const lang = get_lang();
//
import config_blog from '../../configs/blog.yaml';
const blog_posts = config_blog.filter((post: blog_post)=>{
    return post.allow_lang.includes(lang);
}) as blog_post[];

//
let filtered_posts = [...blog_posts] as blog_post[];
let search_keyword = '';
let selected_category = '';
let selected_tag = '';
let view_mode = 'grid';

const e_search_input = $('.filter-item-container:eq(0) mdui-text-field');
const e_categories_container = $('.filter-item-container:eq(1) .categories');
const e_tags_container = $('.filter-item-container:eq(2) .tags');
const added_categories = new Set<string>();
const added_tags = new Set<string>();
for (const post of blog_posts) {
    if (post.category && !added_categories.has(post.category)) {
        added_categories.add(post.category);
    };
    if (post.tags) {
        for (const tag of post.tags) {
            if (tag.trim() && !added_tags.has(tag)) {
                added_tags.add(tag);
            };
        };
    };
};
e_categories_container.empty();
added_categories.forEach((cate: string) => {
    e_categories_container.append(`<mdui-chip selectable value="${cate}">${cate}</mdui-chip>`);
});
e_tags_container.empty();
added_tags.forEach((tag: string) => {
    e_tags_container.append(`<mdui-chip selectable value="${tag}">${tag}</mdui-chip>`);
});

const e_category_chips = $('.filter-item-container:eq(1) mdui-chip');
const e_tag_chips = $('.filter-item-container:eq(2) mdui-chip');
function chip_clear_selection($chips: JQuery) {
    $chips.each((_: any, el: any) => {
        (el as any).selected = false;
    });
};
function filter_posts() {
    filtered_posts = blog_posts.filter((post: blog_post) => {
        if (search_keyword) {
            if (post.title.toLowerCase().indexOf(search_keyword.toString().toLowerCase()) === -1) {
                return false;
            };
        };
        if (selected_category) {
            if (post.category !== selected_category) {
                return false;
            };
        };
        if (selected_tag) {
            if (!post.tags || !post.tags.includes(selected_tag)) {
                return false;
            };
        };
        return true;
    });
};
function update_url() {
    const params = new URLSearchParams();
    if (search_keyword) {params.set('name', search_keyword);};
    if (selected_category) {params.set('cate', selected_category);};
    if (selected_tag) {params.set('tag', selected_tag);};
    if (view_mode !== 'grid') {params.set('view', view_mode);};
    const newUrl = `${window.location.pathname}${params.toString() ? '?' : ''}${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
};
function init_from_url() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const cate = params.get('cate');
    const tag = params.get('tag');
    const view = params.get('view');
    if (name) {
        search_keyword = name;
        (e_search_input[0] as any).value = name;
    };
    if (cate) {
        selected_category = cate;
        e_category_chips.each((_: any, el: any) => {
            if (el.getAttribute('value') === cate) {
                el.selected = true;
            };
        });
    };
    if (tag) {
        selected_tag = tag;
        e_tag_chips.each((_: any, el: any) => {
            if (el.getAttribute('value') === tag) {
                el.selected = true;
            };
        });
    };
    if (view) {
        view_mode = view;
        (e_view_switch[0] as any).checked = true;
    };
    filter_posts();
    show_posts();
};

e_search_input.on('input', () => {
    search_keyword = (e_search_input[0] as any).value || '';
    filter_posts();
    show_posts();
    update_url();
});
e_category_chips.on('change', (e: any) => {
    const el = e.target as any;
    const val = el.getAttribute('value') || el.innerText.trim();
    if (el.selected) {
        if (selected_category !== val) {
            chip_clear_selection(e_category_chips);
            el.selected = true;
            selected_category = val;
        };
    } else {
        if (selected_category === val) {
            selected_category = '';
        };
    };
    filter_posts();
    show_posts();
    update_url();
});
e_tag_chips.on('change', (e: any) => {
    const el = e.target as any;
    const val = el.getAttribute('value') || el.innerText.trim();
    if (el.selected) {
        if (selected_tag !== val) {
            chip_clear_selection(e_tag_chips);
            el.selected = true;
            selected_tag = val;
        };
    } else {
        if (selected_tag === val) {
            selected_tag = '';
        };
    };
    filter_posts();
    show_posts();
    update_url();
});

const e_blog_posts = $('.posts');
const e_view_switch = $('mdui-switch');
const e_badge = $('mdui-badge');
function show_posts(){
    e_blog_posts.empty();
    if(!e_view_switch.prop('checked')){
        e_blog_posts.addClass('posts');
        filtered_posts.forEach((post: blog_post)=>{
            e_blog_posts.append(`
                <mdui-tooltip content="${post.title}"> 
                    <mdui-card variant="filled" class="post" href="${
                            post.filename ? `./posts/${post.filename}/` 
                        : post.href}">
                        <div class="v-box post-content">
                            <h2>${post.title}</h2>
                            <p>${post.desc ? post.desc : ''}</p>
                            <div class="h-box post-tags">
                                ${post.date ? `
                                    <mdui-tooltip content="${post.date}" placement="right">
                                        <mdui-chip variant="input">
                                            <mdui-icon-access-time slot="icon"></mdui-icon-access-time>
                                            <span></span>
                                        </mdui-chip>
                                    </mdui-tooltip>
                                ` : ''}
                                <mdui-chip selected>
                                    <mdui-icon-category--outlined slot="selected-icon"></mdui-icon-category--outlined>
                                    ${post.category}
                                </mdui-chip>
                                ${post.tags ? post.tags.map((tag: string)=>{return `
                                    <mdui-chip>
                                        <mdui-icon-tag slot="icon"></mdui-icon-tag>
                                        ${tag}
                                    </mdui-chip>
                                `;}).join('') : ''}
                            </div>
                        </div>
                    </mdui-card>
                </mdui-tooltip>
            `);
        });
    } else {
        e_blog_posts.removeClass('posts');
        e_blog_posts.append($('<mdui-list></mdui-list>').append(
            filtered_posts.map((post: blog_post)=>`
                <mdui-tooltip content="${post.desc}">
                    <mdui-list-item href="${post.filename ? `./posts/${post.filename}/` : post.href}">
                        <div class="h-box post-list-subt">
                            <span>${post.date}</span>
                            <span>${post.category}${post.tags ? ' / ' : ''}${post.tags ? post.tags.join(' · '): ''}</span>
                        </div>
                        <h2>${post.title}</h2>
                    </mdui-list-item>
                </mdui-tooltip>
            `).join(''))
        );
    };
    e_badge.text(`${filtered_posts.length}`)
};
show_posts();
init_from_url();
e_view_switch.on('change',()=>{
    view_mode = (e_view_switch[0] as any).checked ? 'list' : 'grid';
    update_url();
    show_posts();
});

// ramd
const e_ramd = $('.ramd');
e_ramd.on('hover mouseenter touchstart mouseup',()=>{
    function get_post(){
        let post = filtered_posts[Math.floor(Math.random() * filtered_posts.length)];
        if(!post.filename){
            return get_post();
        };
        return post.filename;
    };
    let post = get_post();
    e_ramd.attr('href', `./posts/${post}/`);
})