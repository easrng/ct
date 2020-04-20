export default function ct(f = () => {}) {
    function argInfo(f = () => {}) {
        function getNestedParens(s = "") {
            let depth = 0;
            let f = ""
            for (let c of s) {
                if (c == "(") depth++
                    else if (c == ")") depth--
                        f += c;
                if (depth == 0) return f
            }
        }
        let aAn = (s = "") => ("aeiou".includes(s.slice(0, 1).toLowerCase()) ? "an" : "a")
        let funcSrc = f.toString();
        funcSrc = funcSrc.slice(funcSrc.indexOf("("))
        let a = getNestedParens(funcSrc).slice(1, -1)
            .split(",");
        if (a.length == 1 && a[0] == "") a = [];
        a = a.map(a => {
            let b = a + "=";
            let c = b.indexOf("=")
            return [b.slice(0, c).trim(), b.slice(c + 1).slice(0, -1).trim()]
        }).map(a => {
            return {
                name: a[0],
                default: a[1]
            }
        })
        for (let e in a) {
            a[e].type = eval("typeof (" + (a[e].default || "undefined") + ")")
        }
        return a
    }
    let a = argInfo(f);
    return (...args) => {
        for (let i in a) {
            let rt = typeof args[i];
            if (a[i].type != "undefined" && rt != a[i].type) throw new TypeError(`Argument "${a[i].name}" requires ${aAn(a[i].type)} ${a[i].type}, not ${aAn(rt)} ${rt}!`)
        }
        return f(...args)
    }
}
