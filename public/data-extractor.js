function getValues(text) {

    let values = {}

    let dateStr = text.match(/\(\d+-\d+-\d{4} \d+:\d+ \w{2}\)/)[0]
    dateStr = dateStr.replace("(", "").replace(")", "")
    values.date = moment(dateStr, "DD-MM-YYYY")

    const regexes = {
        positive: /ഇന്ന്\s+([0-9,])+\s+പേര്‍ക്ക്\s+കോവിഡ്-19/,
        deaths: /([0-9,])+\s+മരണങ്ങളാണ്\s+ഇന്ന്\s+കോവിഡ്/,
        negative: /രോഗം\s+സ്ഥിരീകരിച്ച്\s+ചികിത്സയിലായിരുന്ന\s+([0-9,]+)\s+പേരുടെ\s+പരിശോധനാഫലം\s+നെഗറ്റീവ്\s+ആയി/,
        samples: /[0-9,]+\s+സാമ്പിളുകളാണ്\s+പരിശോധിച്ചത്/,
        unknown: /[0-9,]+\s+പേരുടെ\s+സമ്പര്‍ക്ക\s+ഉറവിടം\s+വ്യക്തമല്ല./
    }

    Object.keys(regexes).forEach(element => {
        let result = text.match(regexes[element])
        if (!result) console.log(`DEBUG [regexes[element], result]: ${[element, result]}`)
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
    const positiveParagraphRegex = /ഇന്ന്\s+[0-9]+\s+പേര്‍ക്ക്\s+കോവിഡ്-19.*എന്നിങ്ങനേയാണ്\s+ജില്ലകളില്‍\s+ഇന്ന്\s+രോഗ\s+ബാധ\s+സ്ഥിരീകരിച്ചത്/
    let positiveParagraph = text.match(positiveParagraphRegex)[0]
    values['positiveDistricts'] = {}
    for (let d in districts) {
        let dRegex = `${districts[d]} [0-9,]+`
        let result = positiveParagraph.match(RegExp(dRegex))
        if (result) {
            result = result[0].match(/[0-9]+/)[0]
            values['positiveDistricts'][d] = parseInt(result)
        }
    }



    const negativeParaRegex = /രോഗം\s+സ്ഥിരീകരിച്ച്\s+ചികിത്സയിലായിരുന്ന\s+[0-9]+\s+പേരുടെ\s+പരിശോധനാഫലം\s+നെഗറ്റീവ്\s+ആയി.\s+.*\s+എന്നിങ്ങനേയാണ്\s+പരിശോധനാ\s+ഫലം\s+ഇന്ന്\s+നെഗറ്റീവായത്. /
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

function SquareFitter()
{
    this.count = 0;
    this.sumX = 0;
    this.sumX2 = 0;
    this.sumX3 = 0;
    this.sumX4 = 0;
    this.sumY = 0;
    this.sumXY = 0;
    this.sumX2Y = 0;
}

SquareFitter.prototype = {
    'add': function(x, y)
    {
        this.count++;
        this.sumX += x;
        this.sumX2 += x*x;
        this.sumX3 += x*x*x;
        this.sumX4 += x*x*x*x;
        this.sumY += y;
        this.sumXY += x*y;
        this.sumX2Y += x*x*y;
    },
    'project': function(x)
    {
        var det = this.count*this.sumX2*this.sumX4 - this.count*this.sumX3*this.sumX3 - this.sumX*this.sumX*this.sumX4 + 2*this.sumX*this.sumX2*this.sumX3 - this.sumX2*this.sumX2*this.sumX2;
        var offset = this.sumX*this.sumX2Y*this.sumX3 - this.sumX*this.sumX4*this.sumXY - this.sumX2*this.sumX2*this.sumX2Y + this.sumX2*this.sumX3*this.sumXY + this.sumX2*this.sumX4*this.sumY - this.sumX3*this.sumX3*this.sumY;
        var scale = -this.count*this.sumX2Y*this.sumX3 + this.count*this.sumX4*this.sumXY + this.sumX*this.sumX2*this.sumX2Y - this.sumX*this.sumX4*this.sumY - this.sumX2*this.sumX2*this.sumXY + this.sumX2*this.sumX3*this.sumY;
        var accel = this.sumY*this.sumX*this.sumX3 - this.sumY*this.sumX2*this.sumX2 - this.sumXY*this.count*this.sumX3 + this.sumXY*this.sumX2*this.sumX - this.sumX2Y*this.sumX*this.sumX + this.sumX2Y*this.count*this.sumX2;
        return (offset + x*scale + x*x*accel)/det;
    }
};

function squareProject(data)
{
    var fitter = new SquareFitter();
    for (var i = 0; i < data.length; i++)
    {
        fitter.add(i, data[i]);
    }
    return [fitter.project(0), fitter.project(data.length - 1)];
}
