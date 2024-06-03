module.exports = {
    isEmpty: (val) => {
        if (val == null) return true;

        if (typeof val === 'boolean') return false;

        if (typeof val === 'number') return !val;

        if (val instanceof Error) return val.message === '';

        switch (Object.prototype.toString.call(val)) {
            case '[object String]':
            case '[object Array]':
                return !val.length;

            case '[object File]':
            case '[object Map]':
            case '[object Set]': {
                return !val.size;
            }

            case '[object Object]': {
                return !Object.keys(val).length;
            }
        }

        return false;
    }
}