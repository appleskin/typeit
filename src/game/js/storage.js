Storage = function() {
	this.available = typeof localStorage !== "undefined";
};

Storage.prototype.constructor = Storage;

Storage.prototype.setItem = function( key, value, overwrite ) {
	if( this.available ) {
		if( localStorage.getItem(key) && !overwrite ) {
            return;
        } else {
            localStorage.setItem(key,value);
        }
        return true;
	} else {
		return false;
	}
};

Storage.prototype.getItem = function( key ) {
	if( this.available ) {
		return localStorage.getItem(key);
	} else {
		return null;
	}
};