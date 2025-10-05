const i18n = {
    one: require("./current-1"),
    two: require("./current-2"),
}

console.log(`
| Lang1 | Lang2 |
|------|-------|`)

console.log(`| **\`${i18n.one.SabbathDate}\`** | **\`${i18n.two.SabbathDate}\`** |`)
console.log(`|||`)
console.log(`| **${i18n.one.Title}** | **${i18n.two.Title}** |`)
console.log(`| _${i18n.one.KeyText}_ | _${i18n.two.KeyText}_ |`)
console.log(`|||`)
console.log(`| _${i18n.one.KeyNote}_ | _${i18n.two.KeyNote}_ |`)
console.log(`|||`)
console.log(`|**Suggested reading**:||`)
console.log(`| _${i18n.one.SuggestedReading.Text}_ | _${i18n.two.SuggestedReading.Text}_ |`)
console.log(`|||`)

if (i18n.one.DayLessons.length !== i18n.two.DayLessons.length) {
    console.log("DayLessons length mismatch")
}

i18n.one.DayLessons.forEach((lesson, index) => {
    const lesson2 = i18n.two.DayLessons[index]
    console.log(`|||`)
    console.log(`| **${lesson.Subtitle}** | **${lesson2.Subtitle}** |`)
    if (lesson.Questions.length !== lesson2.Questions.length) {
        console.log("Questions length mismatch")
    }
    lesson.Questions.forEach((question, index) => {
        const question2 = lesson2.Questions[index]
        console.log(`| **${question.Text}** | **${question2.Text}** |`)
        if (question.VerseRefs?.length !== question2.VerseRefs?.length) {
            console.log("VerseRefs length mismatch")
        }
        if (question.VerseRefs) {
            question.VerseRefs.forEach((verse, index) => {
                const verse2 = question2.VerseRefs[index]
                console.log(`| **_${verse.Text}_** | **_${verse2.Text}_** |`)
                if (verse.Verse.length !== verse2.Verse.length) {
                    console.log("Verse length mismatch")
                }
                verse.Verse.forEach((_verse, index) => {
                    const _verse2 = verse.Verse[index]
                    console.log(`| _${_verse.Text}_ | _${_verse2.Text}_ |`)
                })
            })
        }
        if (question.SopText?.length !== question2.SopText?.length) {
            console.log("SopText length mismatch")
        }
        if (question.SopText) {
            question.SopText.forEach((sopText, index) => {
                const sopText2 = question2.SopText[index]
                console.log(`| ${sopText} | ${sopText2} |`)
            })
        }
    })
})

return;
data.DayLessons.forEach((lesson, index) => {
    console.log(`|||`)
    console.log(`## ${lesson.Subtitle}`)
    lesson.Questions.forEach((question, index) => {
        console.log(`**${question.Text}**`)
        if (question.VerseRefs) {
            console.log("")
            question.VerseRefs.forEach((verse, index) => {
                console.log(`_**${verse.Text}**_`)
                verse.Verse.forEach(verse => {
                    console.log(`_${verse.Text}_`)
                })
            })
            console.log("")
        }
        if (question.SopText) {
            console.log(`${question.SopText.join("\n\n")}`)
            console.log("")
        }
        console.log("")
    })
})
