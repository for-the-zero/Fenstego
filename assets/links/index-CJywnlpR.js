import{a as e,c as t,d as n,f as r,i,m as a,o,r as s,s as c,u as l}from"../global-CSmXtgRW.js";import"../modulepreload-polyfill-CXK8biUa.js";import"../arrow-back-CTGA1Xi_.js";var u=a(r(),1),d=class extends c{render(){return i(`<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>`)}};d.styles=e,d=t([o(`mdui-icon-content-copy`)],d);var f=class extends c{render(){return i(`<path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>`)}};f.styles=e,f=t([o(`mdui-icon-open-in-new`)],f);var p=class extends c{render(){return i(`<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>`)}};p.styles=e,p=t([o(`mdui-icon-label`)],p);var m=class extends c{render(){return i(`<path d="m16 7 3.55 5-1.63 2.29 1.43 1.43L22 12l-4.37-6.16C17.27 5.33 16.67 5 16 5l-7.37.01 2 1.99H16zM2 4.03l1.58 1.58C3.22 5.96 3 6.46 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.28 0 .55-.07.79-.18L18.97 21l1.41-1.41L3.41 2.62 2 4.03zM14.97 17H5V7.03L14.97 17z"/>`)}};m.styles=e,m=t([o(`mdui-icon-label-off--outlined`)],m);var h={"zh-CN":{translations:[{selector:`mdui-top-app-bar-title`,target:`inner-html`,text:`链接`},{selector:`mdui-top-app-bar > mdui-tooltip`,target:`content`,text:`展开标签`}],_other:{title:`链接 | Revealry 示例`,copied_snackbar_msg:`复制成功`}},en:{translations:[{selector:`mdui-top-app-bar-title`,target:`inner-html`,text:`Links`},{selector:`mdui-top-app-bar > mdui-tooltip`,target:`content`,text:`Unfold Labels`}],_other:{title:`links | Revealry Demo`,copied_snackbar_msg:`Copied!`}}},g={"zh-CN":[{title:`测试1`,items:[{name:`Github`,img:`mdi--github.svg`,description:`这是这个项目的Github地址`,links:[{name:`链接`,content:`https://github.com/for-the-zero/Revealry`,type:`url`},{name:`名字`,content:`Revealry`,type:`text`}]},{name:`测试114514`,img:`https://placehold.net/shape-400x400.png`,description:`测试
line1
line2
line3
`,links:[{name:`114514`,content:`/sitemap.xml`,type:`url`}]}]},{title:`测试2`,items:[{name:`测试1919810`,img:`f7--number.png`,description:`测试`,links:null}]}],en:[{title:`Test1`,items:[{name:`Github`,img:`mdi--github.svg`,description:`This is the Github address of this project`,links:[{name:`Link`,content:`https://github.com/for-the-zero/Revealry`,type:`url`},{name:`Name`,content:`Revealry`,type:`text`}]},{name:`Test114514`,img:`https://placehold.net/shape-400x400.png`,description:`Test
line1
line2
line3
`,links:[{name:`114514`,content:`1919810`,type:`text`}]}]},{title:`Test2`,items:[{name:`Test1919810`,img:`f7--number.png`,description:`Test`,links:null}]}]};n(h);var _=l(),v=g[_],y=(0,u.default)(`.container`),b=(0,u.default)(`.link-detail`),x=(0,u.default)(`.link-detail > .v-box`),S=(0,u.default)(`mdui-top-app-bar > mdui-tooltip > mdui-button-icon`);C();function C(){v!==null&&v.forEach(e=>{y.append(`<h1>${e.title}</h1>`);let t=(0,u.default)(`<div></div>`);e.items&&e.items.forEach(e=>{let n=(0,u.default)(`
                    <mdui-tooltip content="${e.name}">
                        <mdui-card variant="filled" clickable>
                            <div class="icon-cont">
                                ${e.img.endsWith(`.svg`)?`
                                    <svg draggable="false" width="44px" height="44px" class="svg-fill">
                                        <use href="../assets/intro/${e.img}" width="44px" height="44px"></use>
                                    </svg>
                                `:`
                                    <img src="${e.img.startsWith(`http://`)||e.img.startsWith(`https://`)?e.img:`../assets/intro/${e.img}`}" draggable="false" />
                                `}
                            </div>
                            <div class="link-label label-hidden">
                                <div class="link-name">${e.name}</div>
                                ${e.description?`<div class="link-desc">${e.description}</div>`:``}
                            </div>
                        </mdui-card>
                    </mdui-tooltip>`);n.on(`click`,()=>{w(e)}),t.append(n)}),y.append(t)})}function w(e){x.empty(),x.append(`
        <div class="h-box link-detail-title">
            ${e.img.endsWith(`.svg`)?`
                <svg draggable="false" width="40px" height="40px" class="svg-fill">
                    <use href="../assets/intro/${e.img}" width="40px" height="40px"></use>
                </svg>
            `:`
                <img src="${e.img.startsWith(`http://`)||e.img.startsWith(`https://`)?e.img:`../assets/intro/${e.img}`}" draggable="false" />
            `}
            <h1>${e.name}</h1>
        </div>
    `),e.description&&x.append(`<p>${e.description}</p>`),e.links&&e.links.forEach(e=>{let t=(0,u.default)(`<div class="h-box"><mdui-text-field variant="outlined" readonly label="${e.name}" value="${e.type===`url`?e.content.replace(/^(https?:\/\/)/,``):e.content}"></mdui-text-field></div>`);if(e.type===`url`)t.append(`<mdui-button-icon href="${e.content}" target="_blank"><mdui-icon-open-in-new></mdui-icon-open-in-new></mdui-button-icon>`);else{let n=(0,u.default)(`<mdui-button-icon><mdui-icon-content-copy></mdui-icon-content-copy></mdui-button-icon>`);n.on(`click`,()=>{navigator.clipboard.writeText(e.content),s({message:h[_]._other.copied_snackbar_msg,autoCloseDelay:500})}),t.append(n)}x.append(t)}),b.attr(`open`,``)}S.on(`change`,()=>{S.attr(`selected`)?(0,u.default)(`.link-label`).removeClass(`label-show`).addClass(`label-hidden`):(0,u.default)(`.link-label`).removeClass(`label-hidden`).addClass(`label-show`)});