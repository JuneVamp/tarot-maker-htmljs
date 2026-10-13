// Source - https://stackoverflow.com/a/25984542
// Posted by cocco, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-12, License - CC BY-SA 3.0

function fy(a,b,c,d){//array,placeholder,placeholder,placeholder
 c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
}
function numberArray(a,b){
 b=[];while(a--)b[a]=a+1;return b
}

// Source - https://stackoverflow.com/a/16308830
// Posted by Paul Welbourne, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-12, License - CC BY-SA 3.0
function toggle_visibility_flex(id) {
    var e = document.getElementById(id);
    if(e.style.display == 'flex')
        e.style.display = 'none';
    else
        e.style.display = 'flex';
}