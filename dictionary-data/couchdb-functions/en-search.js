function index(a, b, c) {
    console.log(a, b)
}

fromEnglish = function (doc) {
    function isElementWithNotCebLuanguageAttribute(xml) {
        return xml[0] === 1
            && (xml.length < 4
            || !(xml[3]["lang"] === "ceb" || xml[3]["language"] === "ceb"));
    }

    function isInterestingNodeName(nodeName) {
        return nodeName !== "pos"
            && nodeName !== "number"
            && nodeName !== "itype"
            && nodeName !== "form";
    }

    function getString(xml) {
        if (typeof xml === "string") return xml;
        else switch (xml[0]) {
            case 1:
                var strs = [];
                var key = xml[1];
                if (isElementWithNotCebLuanguageAttribute(xml)
                    && isInterestingNodeName(key)
                    && xml[2]) {
                    for (var xi = 0; xi < xml[2].length; xi++) {
                        var val = xml[2][xi];
                        if (typeof val === "string") {
                            val = val.replace(/[0-9-\.=←→,!?:\(\)\*\s]+/g, " ").trim();
                            if (val.length > 0) strs.push(val);
                        } else {
                            var val2 = getString(val);
                            val2 = val2.replace(/[0-9-\.=←→,!?:\(\)\*\s]+/g, " ").trim();
                            if (val2.length > 0) strs.push(val2);
                        }
                    }
                }
                return strs.join(' ');
            default:
                return "COULD NOT HANDLE ELEMENT TYPE " + xml[0] + "?!?!?!?!?!?!";
        }
    }

    function getStrings(xml) {
        var strs = [];
        if (typeof xml === "object") {
            if (isElementWithNotCebLuanguageAttribute(xml)) {
                strs.push(getString(xml));
            } else {
                for (var key in xml) if (xml.hasOwnProperty(key)) {
                    var str = getStrings(xml[key]);
                    if (!!str) strs.push(str);
                }
            }
        }

        return strs.join(" ").replace(/ [a-z] /gi, " ");
    }

    if (doc.entry) index("default", getStrings(doc.entry), {"store": true});
    if (doc.translations) index("synonym", doc.translations.join('; '), {"store": true});
}


exports.default = fromEnglish;