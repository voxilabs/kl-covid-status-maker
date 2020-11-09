function getValues(text) {

    let values = {}

    const regexes = {
        positive: /സംസ്ഥാനത്ത് ഇന്ന് ([0-9,])+ പേര്‍ക്ക് കോവിഡ്-19 സ്ഥിരീകരിച്ചു/i,
        deaths: /([0-9,])+ മരണങ്ങളാണ് ഇന്ന് കോവിഡ്/,
        negative: /രോഗം സ്ഥിരീകരിച്ച് ചികിത്സയിലായിരുന്ന ([0-9,]+) പേരുടെ പരിശോധനാഫലം നെഗറ്റീവ് ആയി/,
        samples: /[0-9,]+ സാമ്പിളുകളാണ് പരിശോധിച്ചത്/,
        unknown: /[0-9,]+ പേരുടെ സമ്പര്‍ക്ക ഉറവിടം വ്യക്തമല്ല./
    }

    Object.keys(regexes).forEach(element => {
        let result = text.match(regexes[element])
        let number = result[0].match(/[0-9,]+/)[0]
        values[element] = parseInt(number.replace(",", ""))
    });


    const districts = {
        14: 'കാസര്‍ഗോഡ്',
        13: 'കണ്ണൂര്‍',
        12: 'വയനാട്',
        11: 'കോഴിക്കോട്',
        10: 'മലപ്പുറം',
        9: 'പാലക്കാട്',
        8: 'തൃശൂര്‍',
        7: 'എറണാകുളം',
        6: 'ഇടുക്കി',
        5: 'കോട്ടയം',
        4: 'ആലപ്പുഴ',
        3: 'പത്തനംതിട്ട',
        2: 'കൊല്ലം',
        1: 'തിരുവനന്തപുരം',
    }
    const positiveParagraphRegex = /സംസ്ഥാനത്ത് ഇന്ന് [0-9]+ പേര്‍ക്ക് കോവിഡ്-19 സ്ഥിരീകരിച്ചു.*എന്നിങ്ങനേയാണ് ജില്ലകളില്‍ ഇന്ന് രോഗ ബാധ സ്ഥിരീകരിച്ചത്/
    let positiveParagraph = text.match(positiveParagraphRegex)[0]
    values['positiveDistricts'] = {}
    for (let d in districts) {
        let dRegex = `${districts[d]} [0-9,]+`
        let result = positiveParagraph.match(RegExp(dRegex))[0].match(/[0-9]+/)[0]
        values['positiveDistricts'][d] = parseInt(result)
    }



    const negativeParaRegex = /രോഗം സ്ഥിരീകരിച്ച് ചികിത്സയിലായിരുന്ന [0-9]+ പേരുടെ പരിശോധനാഫലം നെഗറ്റീവ് ആയി. .* എന്നിങ്ങനേയാണ് പരിശോധനാ ഫലം ഇന്ന് നെഗറ്റീവായത്. /
    let negativeParagraph = text.match(negativeParaRegex)[0]
    values['negativeDistricts'] = {}
    for (let d in districts) {
        let dRegex = `${districts[d]} [0-9,]+`
        let result = negativeParagraph.match(RegExp(dRegex))[0].match(/[0-9]+/)[0]
        values['negativeDistricts'][d] = parseInt(result)
    }

    return values
}
