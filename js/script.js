function leadZeroes(num,pla){
    num = num.toString()
    if(num.length < pla) num = "0".repeat(pla-num.length)+num;
    return num;
}
function init(){
    $('.parallax').parallax();
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    $('.collapsible').collapsible(); 
    $('select').formSelect();
    $('.modal').modal();
}
$(document).ready(function(){
    init()
});
