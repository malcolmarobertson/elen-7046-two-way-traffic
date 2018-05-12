class Resources {

    constructor() {
        this.resourceCache = {};
        this.loading = [];
        this.readyCallbacks = [];     
        this.load([
            'images/stone-block.png',
            'images/grass-block.png',
            'images/car-l-r.png',
            'images/car-r-l.png',
            'images/char-boy.png'
        ]);   
    }

    //loads images into object
    load(urlOrArr) {
        var that = this;
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                that._load(url);
            });
        } else {
            this._load(urlOrArr);
        };
    }

    //this function should be private but not found a way to do so in JS
    _load(url) {
        var that = this;
        
        if(this.resourceCache[url]) {
            return this.resourceCache[url];
        } else {
            var img = new Image();
            img.onload = function() {
                that.resourceCache[url] = img;

                if(that.isReady()) {
                    that.readyCallbacks.forEach(function(func) { func(); });
                }
            };

            this.resourceCache[url] = false;
            img.src = url;
        }
    }

    //gets the image
    get(url) {
        return this.resourceCache[url];
    }

    // checks if image is loaded and ready for use
    isReady() {
        var ready = true;
        for(var k in this.resourceCache) {
            if(this.resourceCache.hasOwnProperty(k) &&
               !this.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    //when images are loaded calls a function as parameter
    onReady(func) {
        this.readyCallbacks.push(func);
    }

    
}