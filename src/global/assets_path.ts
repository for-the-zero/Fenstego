const path = window.location.pathname;
var assets_path = '';
if(path.includes('blog/posts/')){
    assets_path = '../../../assets/';
} else if(path.includes('blog/') || path.includes('links/') || path.includes('intro/')){
    assets_path = '../assets/';
} else {
    assets_path = './assets/';
};
export { assets_path };