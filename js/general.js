function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


function isiPhone5(){
    return (window.screen.height == (1136 / 2));
}

function isiPhone4() {
	return(window.devicePixelRatio >= 2);
}

function isiPad(){
    return navigator.userAgent.match(/iPad/i) != null;
}
