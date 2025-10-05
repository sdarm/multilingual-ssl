const data = require("./current")

console.log(`**\`${data.SabbathDate}\`**`)
console.log("")
console.log(`# ${data.Title}`)

console.log("")

console.log(`_${data.KeyText}_`)

console.log("")
console.log(`${data.KeyNote}`)

console.log(`**Suggested Reading**: _${data.SuggestedReading.Text}_`)

data.DayLessons.forEach((lesson, index) => {
    console.log("")
    console.log(`## ${lesson.Subtitle}`)
    lesson.Questions.forEach((question, index) => {
        console.log(`**${question.Text}**`)
        if (question.VerseRefs) {
            console.log("")
            question.VerseRefs.forEach((verse, index) => {
                console.log(`_**${verse.Text}**_`)
                if (!verse.Verse) { return }
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
