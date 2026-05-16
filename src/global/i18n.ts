import $ from 'jquery';

var lang: string = 'en';

export function get_lang(){
    let lang_in_ls = localStorage.getItem('lang');
    if(lang_in_ls){
        lang = lang_in_ls;
    }else{
        if(navigator.language === 'zh-CN'){
            lang = 'zh-CN';
        }else{
            lang = 'en';
        };
        localStorage.setItem('lang', lang);
    };
    return lang;
};

function handle_query(){
    let params = new URLSearchParams(window.location.search);
    if(params.has('lang')){
        lang = params.get('lang') as string;
        localStorage.setItem('lang', lang === 'zh-CN' ? 'zh-CN' : 'en');
        params.delete('lang');
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState(null, '', newUrl);
    };
};

export function init_i18n(i18n_File: staticinfo){
    handle_query();
    get_lang();
    if(i18n_File[lang]._other?.title){
        document.title = i18n_File[lang]._other.title;
    };
    if(i18n_File[lang]._other?.eval){
        eval(i18n_File[lang]._other.eval);
    };
    if(i18n_File[lang].translations !== null){
        for(let index: number = 0; index < i18n_File[lang].translations.length; index++){
            let tl = i18n_File[lang].translations[index];
            let ele2Btl = $(tl.selector);
            if(tl.target === 'inner-html'){
                ele2Btl.html(tl.text);
            } else if(tl.target === 'text'){
                ele2Btl.text(tl.text);
            } else if(tl.target === 'replace'){
                ele2Btl.replaceWith($(tl.text));
            } else {
                ele2Btl.attr(tl.target, tl.text);
            };
        };
    };
};

export function change_lang(){
    localStorage.setItem('lang', lang === 'zh-CN' ? 'en' : 'zh-CN');
    location.reload();
};