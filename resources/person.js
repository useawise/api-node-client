exports.register = function(jsonApi) {
    jsonApi.define('person', {
        personType: '',
        client: '',
        supplier: '',
        salesperson: '',
        carrier: '',
        employee: '',
        nationalIdNum: '',
        rg: '',
        inscricaoEstadual: '',
        inscricaoMunicipal: '',
        name: '',
        legalName: '',
        code: '',
        birthDate: '',
        sex: '',
        creditLimit: '',
        salespersonPerson: {
            jsonApi: 'one',
            type: 'persons'
        },
        priority: '',
        status: '',
        personOrigin: {
            jsonApi: 'one',
            type: 'person-origins'
        },
        emailXml: '',
        observation: '',
        motherName: '',
        fatherName: '',
        workLocation: '',
        admissionDate: '',
        monthlyIncome: '',
        professionalReferences: '',
        createdDateTime: '',
        changedDateTime: '',
        removedDateTime: '',
        contacts: {
            jsonApi: 'hasMany',
            type: 'person-contacts'
        },
        addresses: {
            jsonApi: 'hasMany',
            type: 'person-addresses'
        },
        customFieldsValues: '',
        flags: '',
        linkedBranch: {
            jsonApi: 'one',
            type: 'branches'
        },
        rntc: ''
    });
}
