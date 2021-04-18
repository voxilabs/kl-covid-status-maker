function getValues(text) {

    let values = {}

    let dateStr = text.match(/\(\d+-\d+-\d{4} \d+:\d+ \w{2}\)/)[0]
    dateStr = dateStr.replace("(", "").replace(")", "")
    values.date = moment(dateStr, "DD-MM-YYYY")

    const regexes = {
        positive: /ഇന്ന്\s+([0-9,])+\s+പേര്‍.*\s+കോവിഡ്-19/,
        deaths: /കഴിഞ്ഞ.*ദിവസങ്ങളിലുണ്ടായ.*([0-9,])+.*മരണങ്ങളാണ്/,
        negative: /രോഗം\s+സ്ഥിരീകരിച്ച്\s+ചികിത്സയിലായിരുന്ന\s+([0-9,]+)\s+പേരുടെ\s+പരിശോധനാഫലം\s+നെഗറ്റീവ്\s+ആയി/,
        samples: /മണിക്കൂറിനിടെ.*[0-9,]+.*സാമ്പിളു/,
        unknown: /[0-9,]+\s+പേരുടെ\s+സമ്പര്‍ക്ക\s+ഉറവിടം\s+വ്യക്തമല്ല./
    }

    Object.keys(regexes).forEach(element => {
        let result = text.match(regexes[element])
        let number = result[0].match(/[0-9]+(,[0-9]+)*/)[0]
        values[element] = Number(number.replace(",", "").replace(",", ""))
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
    const positiveParagraphRegex = /ഇന്ന്\s+[0-9,]+\s+പേര്‍ക്ക്.*\s+കോവിഡ്-19.*എന്നിങ്ങനേയാണ്\s+ജില്ലകളില്‍\s+ഇന്ന്\s+രോഗ\s+ബാധ\s+സ്ഥിരീകരിച്ചത്/
    let positiveParagraph = text.match(positiveParagraphRegex)[0]
    values['positiveDistricts'] = {}
    for (let d in districts) {
        let dRegex = `${districts[d]} [0-9,]+`
        let result = positiveParagraph.match(RegExp(dRegex))
        if (result) {
            result = result[0].match(/[0-9,]+/)[0]
            values['positiveDistricts'][d] = parseInt(result)
        }
    }



    const negativeParaRegex = /രോഗം\s+സ്ഥിരീകരിച്ച്\s+ചികിത്സയിലായിരുന്ന\s+[0-9,]+\s+പേരുടെ\s+പരിശോധനാഫലം\s+നെഗറ്റീവ്\s+ആയി.\s+.*\s+എന്നിങ്ങനേയാണ്\s+പരിശോധനാ\s+ഫലം\s+ഇന്ന്\s+നെഗറ്റീവായത്./
    let negativeParagraph = text.match(negativeParaRegex)[0]
    values['negativeDistricts'] = {}
    for (let d in districts) {
        let dRegex = `${districts[d]} [0-9,]+`
        let result = negativeParagraph.match(RegExp(dRegex))
        if (result) {
            result = result[0].match(/[0-9]+/)[0]
            values['negativeDistricts'][d] = parseInt(result)
        }
    }

    return values
}

