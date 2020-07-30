exports.register = function(jsonApi) {
    jsonApi.define('person-contact', {
        name: '',
        value: '',
        contactType: {
            jsonApi: 'one',
            type: 'contact-types'
        }
    });
}

