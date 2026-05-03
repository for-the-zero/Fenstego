import{a as e,c as t,d as n,f as r,i,m as a,o,s,u as c}from"../global-R8TqVzZ4.js";import"../modulepreload-polyfill-CXK8biUa.js";import"../arrow-back-C-5qLxuX.js";import"../shuffle-BkVF1mv-.js";import"../access-time-oPsA8KWs.js";var l=a(r(),1),u=class extends s{render(){return i(`<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>`)}};u.styles=e,u=t([o(`mdui-icon-search`)],u);var d=class extends s{render(){return i(`<path d="M7 6h10l-5.01 6.3L7 6zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04c-.83 0-1.3.95-.79 1.61z"/>`)}};d.styles=e,d=t([o(`mdui-icon-filter-alt--outlined`)],d);var f=class extends s{render(){return i(`<path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>`)}};f.styles=e,f=t([o(`mdui-icon-grid-view--outlined`)],f);var p=class extends s{render(){return i(`<path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>`)}};p.styles=e,p=t([o(`mdui-icon-list`)],p);var m={"zh-CN":{translations:[{selector:`mdui-top-app-bar-title`,target:`inner-html`,text:`博客`},{selector:`mdui-top-app-bar > mdui-tooltip`,target:`content`,text:`随机看一篇`},{selector:`.container > h1`,target:`inner-html`,text:`欢迎来到博客页面`},{selector:`.container > p`,target:`inner-html`,text:`一些描述`},{selector:`mdui-collapse-item > mdui-list-item > div.h-box > span`,target:`inner-html`,text:`筛选`},{selector:`mdui-collapse-item > mdui-list-item > mdui-tooltip`,target:`content`,text:`切换视图（卡片/列表）`}],_other:{title:`博客 | Revealry 示例`}},en:{translations:[{selector:`mdui-top-app-bar-title`,target:`inner-html`,text:`Blog`},{selector:`mdui-top-app-bar > mdui-tooltip`,target:`content`,text:`Random Post`},{selector:`.container > h1`,target:`inner-html`,text:`Welcome to My Blog!`},{selector:`.container > p`,target:`inner-html`,text:`desc`},{selector:`mdui-collapse-item > mdui-list-item > div.h-box > span`,target:`inner-html`,text:`Filter`},{selector:`mdui-collapse-item > mdui-list-item > mdui-tooltip`,target:`content`,text:`Toggle View`}],_other:{title:`Blog | Revealry Demo`}}},h=[{title:`Test Post 1`,desc:`markdwon test`,date:`1900-01-01 00:00:00`,filename:`test1`,category:`normal`,tags:[`test1`],allow_lang:[`zh-CN`,`en`]},{title:`Test Post 2`,desc:`markdwon test2`,date:`1900-01-01 00:00:00`,filename:`test2`,category:`normal`,tags:[`test2`],allow_lang:[`zh-CN`,`en`]},{title:`link`,desc:`link to Github`,date:`1900-01-01 00:00:00`,href:`https://github.com/`,category:`link`,tags:[`git`,`test1`],allow_lang:[`en`]},{title:`跳转`,desc:`到GitHub`,date:`1900-01-01 00:00:00`,href:`https://github.com/`,category:`link`,tags:[`github`,`test2`],allow_lang:[`zh-CN`]},{title:`no tags`,desc:`no tags test`,date:`1900-01-01 00:00:00`,href:`#`,category:`normal`,tags:null,allow_lang:[`zh-CN`,`en`]}];n(m);var g=c(),_=h.filter(e=>e.allow_lang.includes(g)),v=[..._],y=``,b=``,x=``,S=`grid`,C=(0,l.default)(`.filter-item-container:eq(0) mdui-text-field`),w=(0,l.default)(`.filter-item-container:eq(1) .categories`),T=(0,l.default)(`.filter-item-container:eq(2) .tags`),E=new Set,D=new Set;for(let e of _)if(e.category&&!E.has(e.category)&&E.add(e.category),e.tags)for(let t of e.tags)t.trim()&&!D.has(t)&&D.add(t);w.empty(),E.forEach(e=>{w.append(`<mdui-chip selectable value="${e}">${e}</mdui-chip>`)}),T.empty(),D.forEach(e=>{T.append(`<mdui-chip selectable value="${e}">${e}</mdui-chip>`)});var O=(0,l.default)(`.filter-item-container:eq(1) mdui-chip`),k=(0,l.default)(`.filter-item-container:eq(2) mdui-chip`);function A(e){e.each((e,t)=>{t.selected=!1})}function j(){v=_.filter(e=>!(y&&e.title.toLowerCase().indexOf(y.toString().toLowerCase())===-1||b&&e.category!==b||x&&(!e.tags||!e.tags.includes(x))))}function M(){let e=new URLSearchParams;y&&e.set(`name`,y),b&&e.set(`cate`,b),x&&e.set(`tag`,x),S!==`grid`&&e.set(`view`,S);let t=`${window.location.pathname}${e.toString()?`?`:``}${e.toString()}`;window.history.replaceState(null,``,t)}function N(){let e=new URLSearchParams(window.location.search),t=e.get(`name`),n=e.get(`cate`),r=e.get(`tag`),i=e.get(`view`);t&&(y=t,C[0].value=t),n&&(b=n,O.each((e,t)=>{t.getAttribute(`value`)===n&&(t.selected=!0)})),r&&(x=r,k.each((e,t)=>{t.getAttribute(`value`)===r&&(t.selected=!0)})),i&&(S=i,F[0].checked=!0),j(),L()}C.on(`input`,()=>{y=C[0].value||``,j(),L(),M()}),O.on(`change`,e=>{let t=e.target,n=t.getAttribute(`value`)||t.innerText.trim();t.selected?b!==n&&(A(O),t.selected=!0,b=n):b===n&&(b=``),j(),L(),M()}),k.on(`change`,e=>{let t=e.target,n=t.getAttribute(`value`)||t.innerText.trim();t.selected?x!==n&&(A(k),t.selected=!0,x=n):x===n&&(x=``),j(),L(),M()});var P=(0,l.default)(`.posts`),F=(0,l.default)(`mdui-switch`),I=(0,l.default)(`mdui-badge`);function L(){P.empty(),F.prop(`checked`)?(P.removeClass(`posts`),P.append((0,l.default)(`<mdui-list></mdui-list>`).append(v.map(e=>`
                <mdui-tooltip content="${e.desc}">
                    <mdui-list-item href="${e.filename?`./posts/${e.filename}/`:e.href}">
                        <div class="h-box post-list-subt">
                            <span>${e.date}</span>
                            <span>${e.category}${e.tags?` / `:``}${e.tags?e.tags.join(` · `):``}</span>
                        </div>
                        <h2>${e.title}</h2>
                    </mdui-list-item>
                </mdui-tooltip>
            `).join(``)))):(P.addClass(`posts`),v.forEach(e=>{P.append(`
                <mdui-tooltip content="${e.title}"> 
                    <mdui-card variant="filled" class="post" href="${e.filename?`./posts/${e.filename}/`:e.href}">
                        <div class="v-box post-content">
                            <h2>${e.title}</h2>
                            <p>${e.desc?e.desc:``}</p>
                            <div class="h-box post-tags">
                                ${e.date?`
                                    <mdui-tooltip content="${e.date}" placement="right">
                                        <mdui-chip variant="input">
                                            <mdui-icon-access-time slot="icon"></mdui-icon-access-time>
                                            <span></span>
                                        </mdui-chip>
                                    </mdui-tooltip>
                                `:``}
                                <mdui-chip selected>
                                    <mdui-icon-category--outlined slot="selected-icon"></mdui-icon-category--outlined>
                                    ${e.category}
                                </mdui-chip>
                                ${e.tags?e.tags.map(e=>`
                                    <mdui-chip>
                                        <mdui-icon-tag slot="icon"></mdui-icon-tag>
                                        ${e}
                                    </mdui-chip>
                                `).join(``):``}
                            </div>
                        </div>
                    </mdui-card>
                </mdui-tooltip>
            `)})),I.text(`${v.length}`)}L(),N(),F.on(`change`,()=>{S=F[0].checked?`list`:`grid`,M(),L()});var R=(0,l.default)(`.ramd`);R.on(`hover mouseenter touchstart mouseup`,()=>{function e(){let t=v[Math.floor(Math.random()*v.length)];return t.filename?t.filename:e()}let t=e();R.attr(`href`,`./posts/${t}/`)});