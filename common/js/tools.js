// 获取URL参数
function getSearch(name){
    var _arr1 = window.location.search.slice(1).split('&');
    for (var i = 0; i < _arr1.length; i++){
        var _arr2 = _arr1[i].split('=');
        if (_arr2[0] == name){
            return _arr2[1];
        }
    }
    return ''
}