import fs from 'fs'

export default function finalizeDoc () {
  const fileName = 'api-dic.json'
  const doc = fs.readFileSync(fileName, 'utf8')
  const indexOfLastComma = doc.lastIndexOf(',')
  const docWithoutLastComma = doc.substring(0, indexOfLastComma)
  const docWithLastBrackets = docWithoutLastComma + '}' + '}'
  fs.writeFileSync(fileName, docWithLastBrackets)
}

finalizeDoc()
