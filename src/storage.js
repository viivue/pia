import {isRecordExpired} from "./expiration-check";

/**
 * Set item
 * @param key
 * @param value
 */
export function setRecord(key, value){
    const storageType = value.storageType;
    const string = JSON.stringify(value);

    // check existence
    const existingValue = getRecord(key);
    if(existingValue !== null){
        const oldStorage = existingValue.storageType;
        if(oldStorage !== storageType){
            // remove if is existed in storage
            removeRecord(key);
        }else{
            // override record
        }
    }

    // set record
    switch(storageType){
        case 'sessionStorage':
            sessionStorage.setItem(key, string);
            break;
        default:
            localStorage.setItem(key, string);
    }
}

/**
 * Get item by key
 * @param key
 * @param returnFullValue
 * @returns {string|null|any}
 */
export function getRecord(key, returnFullValue = false){
    // check local storage by default
    let value = localStorage.getItem(key);

    // check session storage
    if(value === null){
        value = sessionStorage.getItem(key);
    }

    // null
    if(value === null){
        return value;
    }

    // parse JSON
    const record = JSON.parse(value);

    // check expires
    if(!isRecordExpired(record)){
        // return value if it has not expired yet
        if(returnFullValue){
            return record;
        }else{
            return record.value;
        }
    }
    console.log('isExpired', isRecordExpired(record), record.key)

    // remove expired item and return null
    removeRecord(record.key, record.storageType);
    return null;
}

/**
 * Remove by key
 * @param key
 * @param storageType
 * @returns {boolean}
 */
export function removeRecord(key, storageType = 'localStorage'){
    switch(storageType){
        case 'sessionStorage':
            sessionStorage.removeItem(key);
            break;
        default:
            localStorage.removeItem(key);
    }
}